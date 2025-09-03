package com.rebecmatchapi.rebecmatch_api.dto.Xml;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Trial {

    @JacksonXmlProperty(localName = "main")
    private Main main;

    @JacksonXmlProperty(localName = "contacts")
    private Contacts contacts;

    @JacksonXmlProperty(localName = "criteria")
    private Criteria criteria;

    @JacksonXmlProperty(localName = "ethics_reviews")
    @JacksonXmlElementWrapper(useWrapping = false)
    private List<EthicsReview> ethicsReviews;

    @JacksonXmlProperty(localName = "secondary_id")
    @JacksonXmlElementWrapper(localName = "secondary_ids")
    private List<SecondaryId> secondaryIds;


    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Main {
        @JacksonXmlProperty(localName = "trial_id")
        private String trialId;
        @JacksonXmlProperty(localName = "date_registration")
        private String dateRegistration;
        @JacksonXmlProperty(localName = "primary_sponsor")
        private String primarySponsor;
        @JacksonXmlProperty(localName = "public_title")
        private String publicTitle;
        @JacksonXmlProperty(localName = "scientific_title")
        private String scientificTitle;
        @JacksonXmlProperty(localName = "date_enrolment")
        private String dateEnrolment;
        @JacksonXmlProperty(localName = "recruitment_status")
        private String recruitmentStatus;
        private String url;
        @JacksonXmlProperty(localName = "study_type")
        private String studyType;
        private String phase;
        @JacksonXmlProperty(localName = "hc_freetext")
        private String hcFreetext;
        @JacksonXmlProperty(localName = "i_freetext")
        private String iFreetext;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Contacts {
        @JacksonXmlProperty(localName = "contact")
        @JacksonXmlElementWrapper(useWrapping = false)
        private List<Contact> contacts;

        public Contact getScientificContact() {
            return contacts.stream()
                    .filter(c -> "scientific".equalsIgnoreCase(c.getType()))
                    .findFirst()
                    .orElse(contacts.isEmpty() ? null : contacts.get(0));
        }
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Contact {
        private String type;
        private String firstname;
        private String lastname;
        private String address;
        private String city;
        private String zip;
        private String telephone;
        private String email;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Criteria {
        @JacksonXmlProperty(localName = "inclusion_criteria")
        private String inclusionCriteria;
        @JacksonXmlProperty(localName = "agemin")
        private String ageMin;
        @JacksonXmlProperty(localName = "agemax")
        private String ageMax;
        private String gender;
        @JacksonXmlProperty(localName = "exclusion_criteria")
        private String exclusionCriteria;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class EthicsReview {
        @JacksonXmlProperty(localName = "approval_date")
        private String approvalDate;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class SecondaryId {
        @JacksonXmlProperty(localName = "sec_id")
        private String secId;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Trials {
        @JacksonXmlElementWrapper(useWrapping = false)
        @JacksonXmlProperty(localName = "trial")
        private List<Trial> trials;
    }
}
