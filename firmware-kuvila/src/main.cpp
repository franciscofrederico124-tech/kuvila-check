#include <LiquidCrystal_I2C.h>
#include <wire.h>
#include <DHT.h>
#include <mat.h>
#include "./functions/connect_to_wifi.h"
#include "./functions/send_data.h"
#include "./hooks/read_sensor.h"
#include "./hooks/actors.h"

String ssid = "Assembly";
String password = "Orieljoelcapitadasilva";

#define mq2_pin 35
#define dht_type DHT11
#define dht_pin 15
#define soil_pin 34

#define water_pump_pin 2

LiquidCrystal_I2C display(0x27, 16, 2);
DHT dht(dht_pin, dht_type);

sensor mq2;
sensor soil_sensor;

actor water_pump;

int water_pump_status = 0;

void setup()
{
  Serial.begin(115200);

  display.init();
  display.backlight();
  display.clear();

  printf("\n| > Disaplay configurado! \n");
  display.print(".. Iniciando ..");
  dht.begin();

  connect_to_wifi(ssid, password);
  analogReadResolution(10);

  mq2.begin(mq2_pin);
  soil_sensor.begin(soil_pin);

  water_pump.begin(water_pump_pin);
}
void loop()
{
  if (WiFi.status() == WL_CONNECTED)
  {

    JsonDocument data;
    String data_system;

    const int air_quality = mq2.read_analog();
    const int air_humidity = (int)(round(dht.readHumidity()));
    const int air_temperature = (int)(round(dht.readTemperature()));
    const int soil_humidity = (int)(round(soil_sensor.read_analog()));

    data["system"]["firmware"] = "Esp32 - kuvila check";
    data["system"]["version"] = "1.0.0";

    data["data"]["air_quality"] = air_quality;
    data["data"]["air_humidity"] = air_humidity;
    data["data"]["air_temperature"] = air_temperature;
    data["data"]["soil_humidity"] = (int)(round(((1024.0 - (float)(soil_humidity)) / 1024.0) * 100));

    data["controlls"]["water_pump"] = water_pump_status;

    serializeJsonPretty(data, data_system);

    String res = send_data(data_system);
    JsonDocument response;

    deserializeJson(response, res);
    water_pump_status = response["controlls"]["water_pump"];

    printf("| > Resposta do servidor: %s", res.c_str());

    water_pump.write(water_pump_status);

    display.clear();
    display.print("H: ");
    display.print(air_humidity);
    display.print(" |T: ");
    display.print(air_temperature);

    delay(10);
  }
  else
  {
    printf("\n| > Não conectado ao wofi. Reconectando...\n");
    WiFi.reconnect();
  }
}