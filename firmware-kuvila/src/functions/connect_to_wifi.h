#pragma
#include <WiFi.h>
#include <Arduino.h>

void connect_to_wifi(String ssid, String password)
{
    WiFi.begin(ssid, password);
    printf("\n| > Conectando ao wifi %s ", ssid.c_str());
    while (WiFi.status() != WL_CONNECTED)
    {
        printf(".");
        delay(500);
    }

    printf("\n| > Sisetma conectado à rede %s\n", ssid.c_str());
}