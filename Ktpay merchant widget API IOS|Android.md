# KTPay Merchant Widget API

# Version change history

### *v2.0*:
* The `api/v1/merchant-widget/payment/hash/acquirer-options` method has been updated
    and the parameters for transmission via the POST form have been eliminated.
    The list of output parameters has been changed.

    Previously there was:
    ```json
    {
      "error": [],
      "response": {
        "success": true,
        "data": {
          "callback_back_url": "https://domain.com/",
          "callback_success_url": "https://domain.com/",
          "callback_failed_url": "https://domain.com/",
          "signed_order": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48ZG9jdW1lbnQ+PG1lcmNoYW50IGNlcnRfaWQ9ImMxODNlNjhjIiBuYW1lPSJOUExVUy5URUNIIj48b3JkZXIgb3JkZXJfaWQ9IjEwOTQ2OSIgYW1vdW50PSIxMDAiIGN1cnJlbmN5PSIzOTgiPjxkZXBhcnRtZW50IG1lcmNoYW50X2lkPSI5ODU0ODYzMSIgYW1vdW50PSIxMDAiIGFib25lbnRfaWQ9IjEiLz48L29yZGVyPjwvbWVyY2hhbnQ+PG1lcmNoYW50X3NpZ24gdHlwZT0iUlNBIj5haDE1ZkRQaFRNclgvUWxOV3lqazB2UERZZnFYblBsUjZSOERtSHpGNGpuNGxFd3RqSWVBZk4xM1dFWE1FSVlEUmJSc09zMlNnMDI5c1Q5Ti94ME1Va2lJbFczODJ4UDd5T0tiNVVlY1V2WHNyWHc0UFZTckEyaVVjQW14Qk50MWdFMGJ3TlcwT2FqQUZNR0s3R2FFamFmWXJXbmxxYlUrUW1GaU5TZkFxaVU9PC9tZXJjaGFudF9zaWduPjwvZG9jdW1lbnQ+",
          "action": "https://epay.kkb.kz/jsp/process/logon.jsp",
          "language": "rus",
          "post_link": "https://card.nplus.tech/api/v1/merchant-widget/payment/488c9a8b24d4f3f6ec5611dd37cefc6e4fdb389s/post-link",
          "back_link": "https://card.nplus.tech/api/v1/merchant-widget/payment/488c9a8b24d4f3f6ec5611dd37cefc6e4fdb389s/back-link",
          "template": "ktwidget_pay_kt.xsl"
        }
      }
    }
    ```
    
    Became:
    
    ```json
    {
      "error": [],
      "response": {
        "success": true,
        "data": {
          "payment_page": "https://epay.homebank.kz/payform/?params=JYOwbg9sDGCmCSATAvABnR9BGAzAVlQHYA2ADgDIAjAQ2gGsAZUO5ACwBd2AHAZwFIcAQT4AmAGKix0agCdEAOhBcANgFce89rGitJ1LsElgskgLawZO6iHYBaAO7BEAc1jtJXagE9zNydAAzRFIAThxiABZqPFI8LADtLBDKEOoSWDCAhMoA0kQ8RGjCk3EaeltlZnIA6mA1GVgAIVpGZmRyLggediYQFg5ufiFJf1kFJTUNLR09AyMSsXNLVms7Rxc3D29fd3FA4LDI6Nj4xOTU9Mzs3PzCguoFzu6Kqpq61QaABS6etvJlazOVTUVzIABKAFVyIhYDxoDJgFx2MAICBkAAVGTWHi0ZGo0SoAIyCCmAkAaXRn0EAE1yLRoBBVDYkMgROQtDJTKBqMo0IRCBFQqgcLZYJRCIhbIKRJRbCERDhYLZEAFUGRYAERFroDg6aZGTZkFh0ORoB8GiBoF5kGSAFrojqsVGwdqwUy1XmmsYAZWoYBdNWUPFgdNU7FYyHpsJ4AH12BA6LAQAIACIADX5nwAomSAFLUiIACQpuYhOAiZKwWYAigB1HCiYjxxMgONeLiwVONWCyCxAA"
        }
      }
    }
    ```
    
    Now it is enough to open the WebView using the `payment_page` parameter to go to the payment page.

### *v1.0*:
Initial version, used to receive and transmit a list of parameters
for the acquirer's bank via a POST form.

# General information

Due to the impossibility of using third-party cookies, in this case the cookies of the KTPay payment widget, there is an option to directly call the acquiring bank's payment page for payment in the iOS|Android application.
This scheme can be used for `Android` applications as well.

To do this, the following steps are required:

1. Create a payment on the KTPay side;
2. Get bank transaction parameters from KTPay;
3. In the application itself on `iOS|Android`, call the payment page of the acquirer's bank;
4. Receiving a PDF receipt of the transaction (optional).

# Create payment

Send a request to create a payment on the KTPay side.

`POST https://fintech.nplus.tech/api/v1/merchant-widget/payment`

**Headers**:

```
Auth-Identifier: app_id
```
where, `app_id` is the identifier of the merchant's application in the KTPay system.

**Body**:

```
BxaXC4/dHhr54eYiW7piJqJ6mWYGTDiLpdRnA5PV/zU5xRrdcA...
```

The body is encrypted with [LibSodium](https://libsodium.gitbook.io/doc/).
An example of an encryption body is in the [JS widget documentation](https://www.npmjs.com/package/@nplus.tech/ktwidget-client) (Transaction parameters).
An example implementation, from our [JS widget package](https://github.com/ktpay/ktwidget-client-js/blob/master/src/widget.js#L77).

**Request example**:

`POST https://fintech.nplus.tech/api/v1/merchant-widget/payment`

**Headers**: 

`Auth-Identifier: 4a75634f2bd897cc69c85a1812e8deas`

**Body**:

```text
BxaXC4/dHhr54eYiW7piJqJ6mWYGTDiLpdRnA5PV/zU5xRrdcA5mPC9IKCqJbX8oub4yQ7OOq3bpBVN3TDgXo7DtLxvUkdH7BQufy30r1HHtcuuH05eBu0Ba8t5cpuepyUxwmHRnGQtT1FoM83Z35s8TtV77HagPeEVoZj9L9cWJcrg9VaVc4ueXIbcvW1h62jNRBs9xhmsASHXR5K92MEHZG6xAOlZHJH5doWS73csA8fduOU8wCPld3Jd/U73Jitdc9M77q83kPEzyNQ7zZgEx2tww5zoLYr1PH57pkf+2gy4OV5ybBYJVqRB3Xd53le8pUwTtbu9+VSE3Ez1icSlvcW4z/19jqplWpBhtEzLzkIc+XWmq
```

**Sample response**:

```json
{
  "error": [],
  "response": {
    "success": true,
    "data": {
      "payment_page": "https://epay.homebank.kz/payform/?params=JYOwbg9sDGCmCSATAvABnR9BGAzAVlQHYA2ADgDIAjAQ2gGsAZUO5ACwBd2AHAZwFIcAQT4AmAGKix0agCdEAOhBcANgFce89rGitJ1LsElgskgLawZO6iHYBaAO7BEAc1jtJXagE9zNydAAzRFIAThxiABZqPFI8LADtLBDKEOoSWDCAhMoA0kQ8RGjCk3EaeltlZnIA6mA1GVgAIVpGZmRyLggediYQFg5ufiFJf1kFJTUNLR09AyMSsXNLVms7Rxc3D29fd3FA4LDI6Nj4xOTU9Mzs3PzCguoFzu6Kqpq61QaABS6etvJlazOVTUVzIABKAFVyIhYDxoDJgFx2MAICBkAAVGTWHi0ZGo0SoAIyCCmAkAaXRn0EAE1yLRoBBVDYkMgROQtDJTKBqMo0IRCBFQqgcLZYJRCIhbIKRJRbCERDhYLZEAFUGRYAERFroDg6aZGTZkFh0ORoB8GiBoF5kGSAFrojqsVGwdqwUy1XmmsYAZWoYBdNWUPFgdNU7FYyHpsJ4AH12BA6LAQAIACIADX5nwAomSAFLUiIACQpuYhOAiZKwWYAigB1HCiYjxxMgONeLiwVONWCyCxAA"
    }
  }
}
```

# <a id="get-bank-transaction-parameters"></a> Get bank transaction parameters

`GET https://fintech.nplus.tech/api/v1/merchant-widget/payment/{transaction_hash}/acquirer-options`

Where, `{transaction_hash}` - hash of the transaction received after creating the payment.

**Request example**:

`GET https://fintech.nplus.tech/api/v1/merchant-widget/payment/488c9a8b24d4f3f6ec5611dd37cefc6e4fdb389s/acquirer-options`

**Sample response**:

```json
{
  "error": [],
  "response": {
    "success": true,
    "data": {
      "payment_page": "https://epay.homebank.kz/payform/?params=JYOwbg9sDGCmCSATAvABnR9BGAzAVlQHYA2ADgDIAjAQ2gGsAZUO5ACwBd2AHAZwFIcAQT4AmAGKix0agCdEAOhBcANgFce89rGitJ1LsElgskgLawZO6iHYBaAO7BEAc1jtJXagE9zNydAAzRFIAThxiABZqPFI8LADtLBDKEOoSWDCAhMoA0kQ8RGjCk3EaeltlZnIA6mA1GVgAIVpGZmRyLggediYQFg5ufiFJf1kFJTUNLR09AyMSsXNLVms7Rxc3D29fd3FA4LDI6Nj4xOTU9Mzs3PzCguoFzu6Kqpq61QaABS6etvJlazOVTUVzIABKAFVyIhYDxoDJgFx2MAICBkAAVGTWHi0ZGo0SoAIyCCmAkAaXRn0EAE1yLRoBBVDYkMgROQtDJTKBqMo0IRCBFQqgcLZYJRCIhbIKRJRbCERDhYLZEAFUGRYAERFroDg6aZGTZkFh0ORoB8GiBoF5kGSAFrojqsVGwdqwUy1XmmsYAZWoYBdNWUPFgdNU7FYyHpsJ4AH12BA6LAQAIACIADX5nwAomSAFLUiIACQpuYhOAiZKwWYAigB1HCiYjxxMgONeLiwVONWCyCxAA"
    }
  }
}
```

# Calling the payment page of the acquiring bank

In the `iOS|Android` application, you need to open the payment page of the acquirer's bank.

It is enough to open the WebView using the `payment_page` parameter to go to the payment page.

The `payment_page` parameter can be taken from [Getting bank transaction parameters](#get-bank-transaction-parameters).

# Receiving PDF transaction receipt (optional)

When you need to receive a PDF receipt of a transaction, you can use the following methods.

`GET https://fintech.nplus.tech/api/v1/merchant-widget/payment/{transaction_hash}/pdf`

Where, `{transaction_hash}` - hash of the transaction received after creating the payment.

**Request example**:

`GET https://fintech.nplus.tech/api/v1/merchant-widget/payment/488c9a8b24d4f3f6ec5611dd37cefc6e4fdb389s/pdf`

**Sample response**:

```
< HTTP/1.1 200 OK
< Date: Thu, 04 Feb 2021 09:49:31 GMT
< Content-Type: application/pdf
< Content-Length: 32323
< Connection: keep-alive
< Pragma: public
< Expires: 0
< Cache-Control: must-revalidate, post-check=0, pre-check=0, private
< Content-Transfer-Encoding: binary
< Content-Disposition: attachment; filename="payment109069-20210126090725.pdf"; filename*=UTF-8''payment109069-20210126090725.pdf
< Access-Control-Allow-Origin: https://ktpay.kz
< Access-Control-Allow-Credentials: true
```
The response body will contain the PDF file `payment109069-20210126090725.pdf`.