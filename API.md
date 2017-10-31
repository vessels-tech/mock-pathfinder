# mock-pathfinder API
The mock-pathfinder server supports two APIs: the Query API over DNS, and the Provisioning API over SOAP.

* [Query API](#query-api)
* [Provisioning API](#provisioning-api)
* [Limitations](#limitations)

## Query API
The Query API is designed to work with the [DNS ENUM protocol](https://tools.ietf.org/html/rfc6116). In order for NAPTR records to be retrieved successfully through the Query API, the records must first be created using the [Provisioning API](#provisioning-api).

Requests can be made against the API using the open source tool `dig`, or using a client like [pathfinder-query-client](https://github.com/mojaloop/pathfinder-query-client).  

* [Example](#example-using-dig)

### Example using dig
`dig @localhost -p 15353 in NAPTR 9.0.3.5.7.6.8.2.1.3.1.e164enum.net`

```
; <<>> DiG 9.8.3-P1 <<>> @localhost -p 15353 in NAPTR 9.0.3.5.7.6.8.2.1.3.1.e164enum.net
; (2 servers found)
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 18835
;; flags: qr rd; QUERY: 1, ANSWER: 2, AUTHORITY: 0, ADDITIONAL: 0
;; WARNING: recursion requested but not available

;; QUESTION SECTION:
;9.0.3.5.7.6.8.2.1.3.1.e164enum.net. IN	NAPTR

;; ANSWER SECTION:
9.0.3.5.7.6.8.2.1.3.1.e164enum.net. 900	IN NAPTR 10 1 "u" "E2U+mm" "!^.*$!mm:001.504@@mojaloop.org!" .
9.0.3.5.7.6.8.2.1.3.1.e164enum.net. 900	IN NAPTR 10 50 "u" "E2U+pstn:tel" "!^(.*)$!tel:\\1\;q_stat=102!" .

;; Query time: 18 msec
;; SERVER: 127.0.0.1#15353(127.0.0.1)
;; WHEN: Mon Oct  2 14:54:53 2017
;; MSG SIZE  rcvd: 175
```

## Provisioning API
The Provisioning API is a SOAP API used to create NAPTR records and associate them with phone numbers. After these records are provisioned, they can be retrieved through the [Query API](#query-api). 

Requests can be made using any HTTP client, or using a dedicated client like [pathfinder-provisioning-client](https://github.com/mojaloop/pathfinder-provisioning-client).

* [Creating NAPTR records for a phone number](#creating-naptr-records-for-a-phone-number)
* [List of commands](#commands)

### Creating NAPTR records for a phone number
There are 2 steps to creating NAPTR records for a phone number. 

1. [Create a profile](#create-profile-for-number)
2. [Activate phone number](#activate-phone-number)

#### Create profile for number
A profile is where the data to build a NAPTR record is stored. A profile consists of a unique ID, and a list of NAPTR records to store with the profile. This profile can then be associated with one or many phone numbers.

To create a profile, the [DefineDNSProfile](#definednsprofile) command will need to be made.

#### Activate phone number
Once you have created a profile, you can associate that profile with a phone number by activating the number. Once the number is activated with a valid profile ID, the NAPTR records associated with the profile can be retrieved for the phone number using the [Query API](#query-api).

To activate the phone number, the [Activate](#activate) command will need to be made.

### Commands

Commands are how you interact with the Provisioning API. SOAP requests are made to the URI `http://localhost:8080/nrs-pi/services/SIPIX/SendRequest`, and the command name and arguments are included in the XML body.

Each command must include a TransactionID element inside the Request element. The value can be anything, but it must be present and should be unique. The value will be returned in the response and can be used for correlation purposes.

* [DefineDNSProfile](#definednsprofile)
* [UpdateDNSProfile](#updatednsprofile)
* [QueryDNSProfile](#querydnsprofile)
* [Activate](#activate)
* [Deactivate](#deactivate)
* [ChangeTN](#changetn)
* [QueryTN](#querytn)

#### DefineDNSProfile

The DefineDNSProfile command is used to create a new profile in mock-pathfinder. You must include a unique ProfileID, and a list of NAPTR records to store with the profile.

| Field | Description | Required | Default |
| ----- | ----------- | -------- | ------- |
| ProfileID | Unique string ID to name the profile | Y | |
| Tier | Tier level of the profile. Must be set to 2. | Y | 2 |
| NAPTR | One or many elements defining the NAPTR records for the profile. Must have at least one record, and no more than 16 | Y | |
| NAPTR.ttl | The DNS time-to-live value for the NAPTR record. Must be an integer value. | Y | |
| NAPTR.DomainName | The terminating domain for the telephone ENUM lookup. Must be set to e164enum.net | Y | |
| NAPTR.Preference | Specifies which NAPTR record to use when multiple NAPTR records show the same value for order. Lower values have priority. | Y | |
| NAPTR.Order | Specifies the order in which records must be processed when multiple records are returned for the same phone number. Number can range from 0 to 65535. Lower values have priority. | Y | |
| NAPTR.flags | Control aspects of the rewriting and interpretation of the fields in the record. | Y | u |
| NAPTR.Service | A character string that specifies the resolution protocol and resolution service(s) that will be available if the rewrite specified by the regexp fields is applied. | Y | |
| NAPTR.Regexp | Identifies the service type (such as sip) plus a dotted IP address or user name and domain name. | Y | |
| NAPTR.Regexp.pattern | Character string containing the rewrite rule. It is applied to the original query string to construct the domain name. | Y | |
| NAPTR.Replacement | Specifies the next domain name (fully qualified) to query for depending on the potential values found in the flags field. The replacement field is used when the regexp is empty. | Y | . |
| NAPTR.CountryCode | | N | false
| NAPTR.Partner | The customer ID of a partner who can view this record. If id attribute set to -1, value must be set to ALL. | N | ALL |
| NAPTR.Partner.id | The customer ID of a partner who can view this record. If set to -1, anyone can view the record. | N | -1 |

##### Request
```
<?xml version="1.0" encoding="UTF-8"?>
<env:Envelope xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:env="http://schemas.xmlsoap.org/soap/envelope/">
<env:Body>
    <Request xmlns="http://www.neustar.biz/sip_ix/prov">
    <DefineDNSProfile>
        <ProfileID>PROFILE-13128675309</ProfileID>
        <Tier>2</Tier>
        <NAPTR ttl="900">
            <DomainName>e164enum.net</DomainName>
            <Preference>1</Preference>
            <Order>10</Order>
            <Flags>u</Flags>
            <Service>E2U+mm</Service>
            <Regexp pattern="^.*$">mm:001.504@@mojaloop.org</Regexp>
            <Replacement>.</Replacement>
            <CountryCode>false</CountryCode>
            <Partner id="-1">ALL</Partner>
        </NAPTR>
        <TransactionID>1506974051732710</TransactionID>
    </DefineDNSProfile>
</Request>
</env:Body>
</env:Envelope>
```

##### Response
```
<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sipix="http://www.neustar.biz/sip_ix/prov" xmlns:sipixws="http://www.neustar.biz/sip_ix/prov/wsdl">
<soap:Body>
    <Response>
        <TransactionID xmlns="http://www.neustar.biz/sip_ix/prov">1506974065629827</TransactionID>
        <ReturnCode xmlns="http://www.neustar.biz/sip_ix/prov">201</ReturnCode>
        <TextMessage xmlns="http://www.neustar.biz/sip_ix/prov">Created</TextMessage>
        <TextMessage xmlns="http://www.neustar.biz/sip_ix/prov">TN provisioned successfully</TextMessage>
        <TextMessage xmlns="http://www.neustar.biz/sip_ix/prov">Date: Mon Oct 02 19:54:25 GMT 2017</TextMessage>
    </Response>
</soap:Body>
</soap:Envelope>
```

#### UpdateDNSProfile
The UpdateDNSProfile command is used to update an existing profile in mock-pathfinder. You must include the ProfileID of the profile you wish to update, and the updated NAPTR records. Note: the records supplied will overwrite any existing records.

| Field | Description | Required | Default |
| ----- | ----------- | -------- | ------- |
| ProfileID | ID of profile to update | Y | |
| NAPTR | One or many elements defining the NAPTR records for the profile. Must have at least one record, and no more than 16 | Y | |
| NAPTR.ttl | The DNS time-to-live value for the NAPTR record. Must be an integer value. | Y | |
| NAPTR.DomainName | The terminating domain for the telephone ENUM lookup. Must be set to e164enum.net | Y | |
| NAPTR.Preference | Specifies which NAPTR record to use when multiple NAPTR records show the same value for order. Lower values have priority. | Y | |
| NAPTR.Order | Specifies the order in which records must be processed when multiple records are returned for the same phone number. Number can range from 0 to 65535. Lower values have priority. | Y | |
| NAPTR.flags | Control aspects of the rewriting and interpretation of the fields in the record. | Y | u |
| NAPTR.Service | A character string that specifies the resolution protocol and resolution service(s) that will be available if the rewrite specified by the regexp fields is applied. | Y | |
| NAPTR.Regexp | Identifies the service type (such as sip) plus a dotted IP address or user name and domain name. | Y | |
| NAPTR.Regexp.pattern | Character string containing the rewrite rule. It is applied to the original query string to construct the domain name. | Y | |
| NAPTR.Replacement | Specifies the next domain name (fully qualified) to query for depending on the potential values found in the flags field. The replacement field is used when the regexp is empty. | Y | . |
| NAPTR.CountryCode | | N | false
| NAPTR.Partner | The customer ID of a partner who can view this record. If id attribute set to -1, value must be set to ALL. | N | ALL |
| NAPTR.Partner.id | The customer ID of a partner who can view this record. If set to -1, anyone can view the record. | N | -1 |

##### Request
```
<?xml version="1.0" encoding="UTF-8"?>
<env:Envelope xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:env="http://schemas.xmlsoap.org/soap/envelope/">
<env:Body>
    <Request xmlns="http://www.neustar.biz/sip_ix/prov">
    <UpdateDNSProfile>
        <ProfileID>PROFILE-13128675309</ProfileID>
        <NAPTR ttl="900">
            <DomainName>e164enum.net</DomainName>
            <Preference>5</Preference>
            <Order>10</Order>
            <Flags>u</Flags>
            <Service>E2U+mm</Service>
            <Regexp pattern="^.*$">mm:001.321@@mojaloop.org</Regexp>
            <Replacement>.</Replacement>
            <CountryCode>false</CountryCode>
            <Partner id="10305"/>
        </NAPTR>
        <NAPTR ttl="900">
            <DomainName>e164enum.net</DomainName>
            <Preference>15</Preference>
            <Order>10</Order>
            <Flags>u</Flags>
            <Service>E2U+mm</Service>
            <Regexp pattern="^.*$">mm:001.123@@mojaloop.org</Regexp>
            <Replacement>.</Replacement>
            <CountryCode>false</CountryCode>
            <Partner id="10305"/>
        </NAPTR>
        <TransactionID>1506981466135956</TransactionID>
    </UpdateDNSProfile>
</Request>
</env:Body>
</env:Envelope>
```

##### Response
```
<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sipix="http://www.neustar.biz/sip_ix/prov" xmlns:sipixws="http://www.neustar.biz/sip_ix/prov/wsdl">
<soap:Body>
    <Response>
        <TransactionID xmlns="http://www.neustar.biz/sip_ix/prov">1506981466135956</TransactionID>
        <ReturnCode xmlns="http://www.neustar.biz/sip_ix/prov">200</ReturnCode>
        <TextMessage xmlns="http://www.neustar.biz/sip_ix/prov">OK</TextMessage>
        <TextMessage xmlns="http://www.neustar.biz/sip_ix/prov">Profile PROFILE-13128675309 successfully updated</TextMessage>
        <TextMessage xmlns="http://www.neustar.biz/sip_ix/prov">Date: Mon Oct 02 21:57:46 GMT 2017</TextMessage>
    </Response>
</soap:Body>
</soap:Envelope>
```

#### QueryDNSProfile
The QueryDNSProfile command is used to retrieve the list of NAPTR records for an existing ProfileID.

| Field | Description | Required | Default |
| ----- | ----------- | -------- | ------- |
| ProfileID | Id of profile to query. | Y | |

##### Request
```
<?xml version="1.0" encoding="UTF-8"?>
<env:Envelope xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:env="http://schemas.xmlsoap.org/soap/envelope/">
<env:Body>
    <Request xmlns="http://www.neustar.biz/sip_ix/prov">
    <QueryDNSProfile>
        <ProfileID>PROFILE-13128675309</ProfileID>
        <TransactionID>1506982007692971</TransactionID>
    </QueryDNSProfile>
</Request>
</env:Body>
</env:Envelope>
```

##### Response
```
<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sipix="http://www.neustar.biz/sip_ix/prov" xmlns:sipixws="http://www.neustar.biz/sip_ix/prov/wsdl">
<soap:Body>
    <Response>
        <TransactionID xmlns="http://www.neustar.biz/sip_ix/prov">1506982007692971</TransactionID>
        <ReturnCode xmlns="http://www.neustar.biz/sip_ix/prov">200</ReturnCode>
        <TextMessage xmlns="http://www.neustar.biz/sip_ix/prov">OK</TextMessage>
        <TextMessage xmlns="http://www.neustar.biz/sip_ix/prov">DNS profile queried successfully</TextMessage>
        <TextMessage xmlns="http://www.neustar.biz/sip_ix/prov">Date: Mon Oct 02 22:06:47 GMT 2017</TextMessage>
        <ResponseData xmlns="http://www.neustar.biz/sip_ix/prov">
        <DNSProfileData>
            <ProfileID>PROFILE-13128675309</ProfileID>
            <Customer id="1234"/>
            <DateCreated>2017-10-02T19:53:02Z</DateCreated>
            <IsInUse>false</IsInUse>
            <Tier>2</Tier>
            <NAPTR ttl="900">
                <DomainName>e164enum.net</DomainName>
                <Preference>5</Preference>
                <Order>10</Order>
                <Flags>u</Flags>
                <Service>E2U+mm</Service>
                <Regexp pattern="^.*$">mm:001.321@@mojaloop.org</Regexp>
                <Replacement>.</Replacement>
                <CountryCode>false</CountryCode>
                <Partner id="10305"/>
            </NAPTR>
            <NAPTR ttl="900">
                <DomainName>e164enum.net</DomainName>
                <Preference>15</Preference>
                <Order>10</Order>
                <Flags>u</Flags>
                <Service>E2U+mm</Service>
                <Regexp pattern="^.*$">mm:001.123@@mojaloop.org</Regexp>
                <Replacement>.</Replacement>
                <CountryCode>false</CountryCode>
                <Partner id="10305"/>
            </NAPTR>
        </DNSProfileData>
    </ResponseData>
</Response>
</soap:Body>
</soap:Envelope>
```

#### Activate
The Activate command is used to create an association between a profile and a telephone number. Once the phone number is activated, the Query API will return the NAPTR records from the profile for the phone number.

| Field | Description | Required | Default |
| ----- | ----------- | -------- | ------- |
| DNSProfileID | Id of profile to associate with phone number. | Y | |
| Status | Status of association between profile and phone number. Must be set to 'active' or 'inactive'. | Y | |
| TN.Base | Phone number to activate. | Y | |
| TN.CountryCode | Country code of phone number to activate. | Y | |

##### Request
```
<?xml version="1.0" encoding="UTF-8"?>
<env:Envelope xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:env="http://schemas.xmlsoap.org/soap/envelope/">
<env:Body>
    <Request xmlns="http://www.neustar.biz/sip_ix/prov">
    <Activate>
        <TN>
            <Base>3128675309</Base>
            <CountryCode>1</CountryCode>
        </TN>
        <Status>active</Status>
        <DNSProfileID>PROFILE-13128675309</DNSProfileID>
        <TransactionID>1506982439493828</TransactionID>
    </Activate>
</Request>
</env:Body>
</env:Envelope>
```

##### Response
```
<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sipix="http://www.neustar.biz/sip_ix/prov" xmlns:sipixws="http://www.neustar.biz/sip_ix/prov/wsdl">
<soap:Body>
    <Response>
        <TransactionID xmlns="http://www.neustar.biz/sip_ix/prov">1506982439493828</TransactionID>
        <ReturnCode xmlns="http://www.neustar.biz/sip_ix/prov">201</ReturnCode>
        <TextMessage xmlns="http://www.neustar.biz/sip_ix/prov">Created</TextMessage>
        <TextMessage xmlns="http://www.neustar.biz/sip_ix/prov">TN provisioned successfully</TextMessage>
        <TextMessage xmlns="http://www.neustar.biz/sip_ix/prov">Date: Mon Oct 02 22:13:59 GMT 2017</TextMessage>
    </Response>
</soap:Body>
</soap:Envelope>
```

#### Deactivate
The Deactivate command is used to remove the association between a profile and a telephone number. Once the phone number is deactivated, the Query API will no longer return the NAPTR records from the profile for the phone number.

| Field | Description | Required | Default |
| ----- | ----------- | -------- | ------- |
| TN.Base | Phone number to deactivate. | Y | |
| TN.CountryCode | Country code of phone number to deactivate. | Y | |

##### Request
```
<?xml version="1.0" encoding="UTF-8"?>
<env:Envelope xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:env="http://schemas.xmlsoap.org/soap/envelope/">
<env:Body>
    <Request xmlns="http://www.neustar.biz/sip_ix/prov">
    <Deactivate>
        <TN>
            <Base>3128675309</Base>
            <CountryCode>1</CountryCode>
        </TN>
        <TransactionID>1506982162734135</TransactionID>
    </Deactivate>
</Request>
</env:Body>
</env:Envelope>
```

##### Response
```
<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sipix="http://www.neustar.biz/sip_ix/prov" xmlns:sipixws="http://www.neustar.biz/sip_ix/prov/wsdl">
<soap:Body>
    <Response>
        <TransactionID xmlns="http://www.neustar.biz/sip_ix/prov">1506982162734135</TransactionID>
        <ReturnCode xmlns="http://www.neustar.biz/sip_ix/prov">200</ReturnCode>
        <TextMessage xmlns="http://www.neustar.biz/sip_ix/prov">OK</TextMessage>
        <TextMessage xmlns="http://www.neustar.biz/sip_ix/prov">TNs deactivated successfully</TextMessage>
        <TextMessage xmlns="http://www.neustar.biz/sip_ix/prov">Date: Mon Oct 02 22:09:22 GMT 2017</TextMessage>
    </Response>
</soap:Body>
</soap:Envelope>
```

#### ChangeTN
The ChangeTN command is used to change the status of the association between the phone number and the profile. If the status is active, querying the number using the Query API will return the NAPTR records for the associated profile. If the status is inactive, the profile records will not be returned in the Query API.

| Field | Description | Required | Default |
| ----- | ----------- | -------- | ------- |
| DNSProfileID | Id of profile to update status. | Y | |
| Status | Status of association between profile and phone number. Must be set to 'active' or 'inactive'. | Y | |
| TN.Base | Phone number associated with profile. | Y | |
| TN.CountryCode | Country code of phone number associated with profile. | Y | |

##### Request

```
<?xml version="1.0" encoding="UTF-8"?>
<env:Envelope xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:env="http://schemas.xmlsoap.org/soap/envelope/">
<env:Body>
    <Request xmlns="http://www.neustar.biz/sip_ix/prov">
    <ChangeTN>
        <TN>
            <Base>3128675309</Base>
            <CountryCode>1</CountryCode>
        </TN>
        <Status>inactive</Status>
        <DNSProfileID>PROFILE-13128675309</DNSProfileID>
        <TransactionID>1506984106267511</TransactionID>
    </ChangeTN>
</Request>
</env:Body>
</env:Envelope>
```

##### Response
```
<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sipix="http://www.neustar.biz/sip_ix/prov" xmlns:sipixws="http://www.neustar.biz/sip_ix/prov/wsdl">
<soap:Body>
    <Response>
        <TransactionID xmlns="http://www.neustar.biz/sip_ix/prov">1506984106267511</TransactionID>
        <ReturnCode xmlns="http://www.neustar.biz/sip_ix/prov">200</ReturnCode>
        <TextMessage xmlns="http://www.neustar.biz/sip_ix/prov">OK</TextMessage>
        <TextMessage xmlns="http://www.neustar.biz/sip_ix/prov">TN profile updated successfully</TextMessage>
        <TextMessage xmlns="http://www.neustar.biz/sip_ix/prov">Date: Mon Oct 02 22:41:46 GMT 2017</TextMessage>
    </Response>
</soap:Body>
</soap:Envelope>
```

#### QueryTN
The QueryTN command is used to obtain a list of the profiles that a phone number is associated with or a list of the phone numbers that are associated with a profile. The QueryTN command is helpful in verifying that a phone number is associated with the correct profile and that a profile has the correct phone numbers associated with it.

##### List profiles associated with a phone number

| Field | Description | Required | Default |
| ----- | ----------- | -------- | ------- |
| TN.Base | Phone number to list profiles. | Y | |
| TN.CountryCode | Country code of phone number to list profiles. | Y | |

###### Request
```
<?xml version="1.0" encoding="UTF-8"?>
<env:Envelope xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:env="http://schemas.xmlsoap.org/soap/envelope/">
<env:Body>
    <Request xmlns="http://www.neustar.biz/sip_ix/prov">
    <QueryTN>
        <TN>
            <Base>3128675309</Base>
            <CountryCode>1</CountryCode>
        </TN>
        <TransactionID>1506984382400071</TransactionID>
    </QueryTN>
</Request>
</env:Body>
</env:Envelope>
```

###### Response
```
<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sipix="http://www.neustar.biz/sip_ix/prov" xmlns:sipixws="http://www.neustar.biz/sip_ix/prov/wsdl">
<soap:Body>
    <Response>
        <TransactionID xmlns="http://www.neustar.biz/sip_ix/prov">1506984382400071</TransactionID>
        <ReturnCode xmlns="http://www.neustar.biz/sip_ix/prov">200</ReturnCode>
        <TextMessage xmlns="http://www.neustar.biz/sip_ix/prov">OK</TextMessage>
        <TextMessage xmlns="http://www.neustar.biz/sip_ix/prov">1 TN profile is queried successfully</TextMessage>
        <TextMessage xmlns="http://www.neustar.biz/sip_ix/prov">Date: Mon Oct 02 22:46:22 GMT 2017</TextMessage>
        <ResponseData xmlns="http://www.neustar.biz/sip_ix/prov">
        <TNData>
            <TN>
                <Base>3128675309</Base>
                <CountryCode>1</CountryCode>
            </TN>
            <Customer id="1234"/>
            <DateCreated>Mon Oct 02 22:13:59 GMT 2017</DateCreated>
            <DateUpdated>Mon Oct 02 22:13:59 GMT 2017</DateUpdated>
            <Status>inactive</Status>
            <DNSProfileID>PROFILE-13128675309</DNSProfileID>
            <Tier>2</Tier>
        </TNData>
    </ResponseData>
</Response>
</soap:Body>
</soap:Envelope>
```

##### List phone numbers in profile

| Field | Description | Required | Default |
| ----- | ----------- | -------- | ------- |
| DNSProfileID | Id of profile to list phone numbers. | Y | |

###### Request
```
<?xml version="1.0" encoding="UTF-8"?>
<env:Envelope xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:env="http://schemas.xmlsoap.org/soap/envelope/">
<env:Body>
    <Request xmlns="http://www.neustar.biz/sip_ix/prov">
    <QueryTN>
        <DNSProfileID>PROFILE-13128675309</DNSProfileID>
        <TransactionID>1506984578739393</TransactionID>
    </QueryTN>
</Request>
</env:Body>
</env:Envelope>
```

###### Response
```
<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sipix="http://www.neustar.biz/sip_ix/prov" xmlns:sipixws="http://www.neustar.biz/sip_ix/prov/wsdl">
<soap:Body>
    <Response>
        <TransactionID xmlns="http://www.neustar.biz/sip_ix/prov">1506984578739393</TransactionID>
        <ReturnCode xmlns="http://www.neustar.biz/sip_ix/prov">200</ReturnCode>
        <TextMessage xmlns="http://www.neustar.biz/sip_ix/prov">OK</TextMessage>
        <TextMessage xmlns="http://www.neustar.biz/sip_ix/prov">1 TN profiles are queried successfully</TextMessage>
        <TextMessage xmlns="http://www.neustar.biz/sip_ix/prov">Date: Mon Oct 02 22:49:38 GMT 2017</TextMessage>
        <ResponseData xmlns="http://www.neustar.biz/sip_ix/prov">
        <TNData>
            <TN>
                <Base>3128675309</Base>
                <CountryCode>1</CountryCode>
            </TN>
            <Customer id="1234"/>
            <DateCreated>Mon Oct 02 22:13:59 GMT 2017</DateCreated>
            <DateUpdated>Mon Oct 02 22:13:59 GMT 2017</DateUpdated>
            <Status>inactive</Status>
            <DNSProfileID>PROFILE-13128675309</DNSProfileID>
            <Tier>2</Tier>
        </TNData>
    </ResponseData>
</Response>
</soap:Body>
</soap:Envelope>
```

## Limitations
Although many efforts have been made for mock-pathfinder to match and behave like the actual PathFinder APIs, some features are not supported, and there may be some behavior that is different. 

Here are lists of known differences for the Query API and the Provisioning API.

### Query API differences
* The terminating domain of the query is not validated in any way. For example, the supported PathFinder domain is `e164enum.net`. If you make a dig query like `dig @localhost -p 15353 in NAPTR 9.0.3.5.7.6.8.2.1.3.1.differentdomain.net`, and there is a record for phone number 13128675309, it will be returned.
* There is no partner support for querying. All records will be returned to any caller, no matter what the Partner ID was set to in the Provisioning API.
* The only validation done is checking if the phone number is valid. Even if the phone number is invalid, the configured default NAPTR record will be returned. If a server error occurs, there will not be a proper DNS error returned.

### Provisioning API differences
* Any of the commands that support a TN field only support a single phone number. If you include multiple TN fields, or try to use the Stop or Size fields as documented in PathFinder, they will not work.
* The phone numbers are not validated that they are real or valid by the Provisioning API. The country codes are only validated for length, and not validated against any known list of country codes.
* Agent support is not supported in the Provisioning API. Customer ID is also not supported, since mock-pathfinder has no way of validating which customer called it. A default Customer ID that is configurable will be returned for any commands that have a Customer field.
* The DateUpdated field is not supported in any command that returns it. It is always set to the same value as the DateCreated field.
* There is no uniqueness check on the TransactionID field. You may use the same value repeatedly.
* The Service NAPTR field is not validated against a list of valid services. You can set the value to anything.
* The Activate command does not support an empty DNSProfileID value. In PathFinder, if you set the DNSProfileID to empty, the status of the association is set to inactive and no DNSProfileID field is returned for either QueryTN calls.

