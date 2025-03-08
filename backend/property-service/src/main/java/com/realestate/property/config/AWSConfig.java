package com.realestate.property.config;

import com.amazonaws.auth.AWSCredentialsProvider;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.auth.DefaultAWSCredentialsProviderChain;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;

@Configuration
public class AWSConfig {

    @Value("${aws.access.key.id:#{null}}")
    private String accessKeyId;

    @Value("${aws.secret.access.key:#{null}}")
    private String secretAccessKey;

    @Value("${aws.s3.region}")
    private String region;

    @Bean
    public AmazonS3 s3Client() {
        AWSCredentialsProvider credentialsProvider;

        // If explicit credentials are provided, use them
        if (StringUtils.hasText(accessKeyId) && StringUtils.hasText(secretAccessKey)) {
            BasicAWSCredentials awsCredentials = new BasicAWSCredentials(accessKeyId, secretAccessKey);
            credentialsProvider = new AWSStaticCredentialsProvider(awsCredentials);
        } else {
            // Otherwise use the default provider chain (environment, instance profile, etc.)
            credentialsProvider = DefaultAWSCredentialsProviderChain.getInstance();
        }

        return AmazonS3ClientBuilder.standard()
                .withRegion(region)
                .withCredentials(credentialsProvider)
                .build();
    }
}