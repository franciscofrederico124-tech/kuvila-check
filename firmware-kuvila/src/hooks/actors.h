#pragma
#include <Arduino.h>

class actor
{
public:
    int pin;
    int status = 0;

    void begin(int pin_el)
    {
        pin = pin_el;
        status = 0;
        pinMode(pin, OUTPUT);
        digitalWrite(pin, status);
    }
    void write(int new_status)
    {
        status = new_status;
        digitalWrite(pin, status);
    }
    void high()
    {
        status = 1;
        digitalWrite(pin, status);
    }
    void low()
    {
        status = 0;
        digitalWrite(pin, status);
    }
};