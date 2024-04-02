# KTPay Merchant Widget API

# История изменений версий

### *v2.0*:
* Обновлен метод `api/v1/merchant-widget/payment/hash/acquirer-options`
    упразднены параметры для передачи через POST форму.
    Изменен список выходных параметров.

    Ранее был:
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
    
    Стал:
    
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
    
    Теперь достаточно открыть WebView используя параметр `payment_page` для перехода на платежную страницу.

### *v1.0*:
* Изначальная версия, используется получение и передача списка параметров
для банка эквайера посредством POST формы.

# Общая информация

Из-за невозможности использования `cookies` третей стороны, в данном случае `cookies` платежного виджета KTPay, есть вариант прямого вызова платежной страницы банка эквайера для оплаты в `iOS|Android` приложении.
Такую схему можно использовать так и для `Android` приложения.

Для этого, необходимы следующие шаги:

1. Создать платеж на стороне KTPay;
2. Получить банковские параметры транзакции от KTPay;
3. В самом приложение на `iOS|Android`, вызвать страницу оплаты банка эквайера;
4. Получение PDF чека транзакции (опционально).

# Создание платежа

Отправляем запрос на создание платежа на стороне KTPay.

`POST https://fintech.nplus.tech/api/v1/merchant-widget/payment`

**Headers**:

```
Auth-Identifier: app_id
```
Где, `app_id` - идентификатор приложения мерчанта в системе KTPay.

**Body**:

```
BxaXC4/dHhr54eYiW7piJqJ6mWYGTDiLpdRnA5PV/zU5xRrdcA...
```

Тело шифруется с помощью [LibSodium](https://libsodium.gitbook.io/doc/).
Пример тела шифрования, есть в [документации JS виджета](https://www.npmjs.com/package/@nplus.tech/ktwidget-client) (Параметры транзакции).
Пример реализации, из нашего пакета [JS виджета](https://github.com/ktpay/ktwidget-client-js/blob/master/src/widget.js#L77).

**Пример запроса**:

`POST https://fintech.nplus.tech/api/v1/merchant-widget/payment`

**Headers**:

`Auth-Identifier: 4a75634f2bd897cc69c85a1812e8deas`

**Body**:

```text
BxaXC4/dHhr54eYiW7piJqJ6mWYGTDiLpdRnA5PV/zU5xRrdcA5mPC9IKCqJbX8oub4yQ7OOq3bpBVN3TDgXo7DtLxvUkdH7BQufy30r1HHtcuuH05eBu0Ba8t5cpuepyUxwmHRnGQtT1FoM83Z35s8TtV77HagPeEVoZj9L9cWJcrg9VaVc4ueXIbcvW1h62jNRBs9xhmsASHXR5K92MEHZG6xAOlZHJH5doWS73csA8fduOU8wCPld3Jd/U73Jitdc9M77q83kPEzyNQ7zZgEx2tww5zoLYr1PH57pkf+2gy4OV5ybBYJVqRB3Xd53le8pUwTtbu9+VSE3Ez1icSlvcW4z/19jqplWpBhtEzLzkIc+XWmq
```

**Пример ответа**:

```json
{
  "error": [],
  "response": {
    "success": true,
    "data": {
      "transaction_hash": "488c9a8b24d4f3f6ec5611dd37cefc6e4fdb389f"
    }
  }
}
```

# <a id="get-bank-transaction-parameters"></a> Получение банковских параметров транзакции

`GET https://fintech.nplus.tech/api/v1/merchant-widget/payment/{transaction_hash}/acquirer-options`

Где, `{transaction_hash}` - хэш транзакции полученный после создания платежа.

**Пример запроса**:

`GET https://fintech.nplus.tech/api/v1/merchant-widget/payment/488c9a8b24d4f3f6ec5611dd37cefc6e4fdb389s/acquirer-options`

**Пример ответа**:

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

# Вызов страницы оплаты банка эквайера

В приложение `iOS|Android`, необходимо вызвать платежную страницу оплаты банка эквайера.

Достаточно открыть WebView используя параметр `payment_page` для перехода на платежную страницу.

Параметр `payment_page` можно взять из [Получение банковских параметров транзакции](#get-bank-transaction-parameters).

# Получение PDF чека транзакции (опционально)
Когда необходимо получить PDF чек транзакции, можно воспользоваться следующий методов.

`GET https://fintech.nplus.tech/api/v1/merchant-widget/payment/{transaction_hash}/pdf`
Где, `{transaction_hash}` - хэш транзакции полученный после создания платежа.

**Пример запроса**:

`GET https://fintech.nplus.tech/api/v1/merchant-widget/payment/488c9a8b24d4f3f6ec5611dd37cefc6e4fdb389s/pdf`

**Пример ответа**:

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
В теле ответа будет PDF файл `payment109069-20210126090725.pdf`.