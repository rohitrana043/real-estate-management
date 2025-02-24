package com.realestate.contact.util;

import com.realestate.contact.model.Contact;
import com.realestate.contact.model.Newsletter;

public class EmailTemplates {

    public static String getContactConfirmationTemplate(Contact contact) {
        return String.format("""
            Dear %s,
            
            Thank you for contacting us. We have received your message and will get back to you within 24 hours.
            
            Your message details:
            Subject: %s
            Message: %s
            
            Best regards,
            Real Estate Team
            """, contact.getName(), contact.getSubject(), contact.getMessage());
    }

    public static String getNewsletterWelcomeTemplate(Newsletter newsletter) {
        return String.format("""
            Welcome to our newsletter!
            
            Thank you for subscribing to our real estate updates. You'll now receive our latest property listings, market insights, and investment opportunities.
            
            To unsubscribe, click here: [Your Frontend URL]/newsletter/unsubscribe?token=%s
            
            Best regards,
            Real Estate Team
            """, newsletter.getUnsubscribeToken());
    }
}