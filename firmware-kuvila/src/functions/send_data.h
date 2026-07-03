#pragma
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <Arduino.h>

String apiBase = "http://192.168.8.195:2000";

String send_data(String data)
{
    if (WiFi.status() == WL_CONNECTED)
    {
        printf("\n| > Enviando dados para API... \n");

        HTTPClient client;
        client.begin(apiBase + "/system/data_system");

        client.addHeader("Content-Type", "application/json");

        int http_code = client.POST(data);

        if (http_code > 0)
        {
            String res = client.getString();
            client.end();
            return res;
        }
        else
        {
            JsonDocument res_doc;
            res_doc["success"] = false;
            res_doc["message"] = "Erro na requisição";
            res_doc["controlls"]["water_pump"] = 0;

            String res;

            serializeJsonPretty(res_doc, res);
            client.end();
            return res;
        }
    }
    else
    {
        JsonDocument res_doc;
        res_doc["success"] = false;
        res_doc["message"] = "Não conectado ao Wifi. Reconectando...";
        res_doc["controlls"]["water_pump"] = 0;

        String res;

        serializeJsonPretty(res_doc, res);
        WiFi.reconnect();
        return res;
    }
}