#pragma once
#include <Arduino.h>

class sensor
{
    public:
        int pin;
        int value;

        void begin(int pin_el)
        {
            pin = pin_el;
            pinMode(pin, INPUT);
        }

        int read_analog()
        {
            value = (int)analogRead(pin);
            return value;
        }

        int read_digital()
        {
            value = (int)(digitalRead(pin));
            return value;
        }

        void print(String message)
        {
            printf("| > %s: %i\n", message.c_str(), value);
        }
};
