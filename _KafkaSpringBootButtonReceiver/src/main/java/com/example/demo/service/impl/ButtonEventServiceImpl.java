package com.example.demo.service.impl;

import com.example.demo.controller.ButtonEventListener;
import com.example.demo.service.ButtonEventService;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ButtonEventServiceImpl implements ButtonEventService {
    private List<ButtonEventListener> listeners = new ArrayList<>();

    @Override
    public void registerListener(ButtonEventListener listener) {
        this.listeners.add(listener);
    }

    @Override
    public void unregisterListener(ButtonEventListener listener) {
        this.listeners.remove(listener);
    }

    private void notifyListeners() {
        for(ButtonEventListener listener : listeners) {
            listener.onButtonClick();
        }
    }

    @KafkaListener(topics = "game-command-events")
    public void listenGroupFoo(String message) {
        System.out.println("Received Message in group foo: " + message);

        notifyListeners();
    }
}
