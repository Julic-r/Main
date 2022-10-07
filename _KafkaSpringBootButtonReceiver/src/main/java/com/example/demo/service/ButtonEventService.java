package com.example.demo.service;

import com.example.demo.controller.ButtonEventListener;

public interface ButtonEventService {
    /**
     * Register a new listener
     * @param listener listener
     */
    void registerListener(ButtonEventListener listener);

    /**
     * Unregister an existing listener
     * @param listener listener
     */
    void unregisterListener(ButtonEventListener listener);
}
