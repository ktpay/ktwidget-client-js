# Использование Ktpay Merchant Widget API

Из-за невозможности использования `cookies` третей стороны, в данном случае `cookies` платежного виджета Ktpay, есть вариант прямого вызова платежной страницы банка эквайера для оплаты в `iOS|Android` приложении.
Такую схему можно использовать так и для `Android` приложения.

Для этого, необходимы следующие шаги:

1. Создать платеж на стороне Ktpay;
2. Получить банковские параметры транзакции от Ktpay;
3. В самом приложение на `iOS|Android`, вызвать страницу оплаты банка эквайера;
4. Получение PDF чека транзакции (опционально).

# Создание платежа

Отправляем запрос на создание платежа на стороне Ktpay.

`POST https://fintech.nplus.tech/api/v1/merchant-widget/payment`

**Headers**:

```
Auth-Identifier: app_id
```
Где, `app_id` - идентификатор приложения мерчанта в системе Ktpay.

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

# Вызов страницы оплаты банка эквайера

В приложение `iOS|Android`, необходимо вызвать платежную страницу оплаты банка эквайера.
Метод вызова `POST`, формат `Multipart form`.
Официальная [документация](https://testpay.kkb.kz/doc/htm/fields_description.html) и [пример](https://testpay.kkb.kz/jsp/client/pay.jsp).

**Пример формы оплаты**:

```html
<form name="SendOrder" method="post" action="{action}">
    <input type="text" name="Signed_Order_B64" size="100" value="{signed_order}">
    <input type="text" id="em" name="email" size="50" maxlength="50" value="info@ktpay.kz">
    <input type="text" name="Language" size="50" maxlength="3" value="{language}">
    <input type="text" name="BackLink" size="50" maxlength="50" value="{back_link}"></td></tr>
    <input type="text" name="PostLink" size="50" maxlength="50" value="{post_link}"></td></tr>
    <input type="text" name="template" value="{template}">
    <input type="submit" id="submit1" name="submit1" value="Pay" onclick="submit1.disabled=true; document.forms[0].submit();">
</form>
```
Где, `{action}` - URL банка эквайера,

`{signed_order}` - шифрованная строка платежа,

`{language}` - язык страницы оплаты,

`{back_link}` - URL возврата после проведения оплаты,

`{post_link}`- URL отправки результата платежа,

`{template}` - шаблон страницы оплаты.

Все параметры можно взять из [Получение банковских параметров транзакции](#get-bank-transaction-parameters).
Изменять можно только параметр `{back_link}`, остальные должны быть исходными, иначе платеж не пройдет успешно.

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