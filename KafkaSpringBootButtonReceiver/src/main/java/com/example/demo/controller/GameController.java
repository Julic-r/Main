package com.example.demo.controller;

import com.example.demo.model.ButtonEvent;
import com.example.demo.service.ButtonEventService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.util.concurrent.ListenableFuture;
import org.springframework.util.concurrent.ListenableFutureCallback;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

import javax.annotation.PostConstruct;

@Log4j2
@RestController
public class GameController {

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    private ButtonEventService buttonEventService;

    @Value(value = "${kafka-topic}")
    private String kafkaTopic;

    @PostMapping("/send-button")
    public ResponseEntity<?> sendButton() {
        log.info("Send button.");

        String message = "Hello world again!";
        ListenableFuture<SendResult<String, String>> future =
                kafkaTemplate.send(kafkaTopic, message);

        future.addCallback(new ListenableFutureCallback<SendResult<String, String>>() {

            @Override
            public void onSuccess(SendResult<String, String> result) {
                System.out.println("Sent message=[" + message +
                        "] with offset=[" + result.getRecordMetadata().offset() + "]");
            }
            @Override
            public void onFailure(Throwable ex) {
                System.out.println("Unable to send message=["
                        + message + "] due to : " + ex.getMessage());
            }
        });

        return ResponseEntity.ok().build();
    }

    @GetMapping("/button-click")
    public Flux<ButtonEvent> getWeatherInfo() {
        return Flux.create(sink -> {
            buttonEventService.registerListener(new ButtonEventListener() {
                @Override
                public void onButtonClick() {
                    sink.next(new ButtonEvent("event"));
                }
            });
        });
    }
}
