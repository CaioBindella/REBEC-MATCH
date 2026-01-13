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

    @JacksonXmlElementWrapper(localName = "ethics_reviews")
    @JacksonXmlProperty(localName = "ethics_review")
    private List<EthicsReview> ethicsReviews;

    @JacksonXmlElementWrapper(localName = "secondary_ids")
    @JacksonXmlProperty(localName = "secondary_id")
    private List<SecondaryId> secondaryIds;

    // Métodos de conveniência para aceder facilmente aos dados aninhados
    public String getTrialId() {
        return main != null ? main.getTrialId() : null;
    }

    public Contact getScientificContact() {
        return contacts != null ? contacts.getScientificContact() : null;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Main {
        @JacksonXmlProperty(localName = "trial_id")
        private String trialId;
        @JacksonXmlProperty(localName = "public_title")
        private String publicTitle;
        @JacksonXmlProperty(localName = "scientific_title")
        private String scientificTitle;
        @JacksonXmlProperty(localName = "recruitment_status")
        private String recruitmentStatus;
        @JacksonXmlProperty(localName = "study_type")
        private String studyType;
        @JacksonXmlProperty(localName = "phase")
        private String phase;
        @JacksonXmlProperty(localName = "url")
        private String url;
        @JacksonXmlProperty(localName = "primary_sponsor")
        private String primarySponsor;
        @JacksonXmlProperty(localName = "hc_freetext")
        private String hcFreeText;
        @JacksonXmlProperty(localName = "i_freetext")
        private String iFreeText;
        @JacksonXmlProperty(localName = "date_registration")
        private String dateRegistration;
        @JacksonXmlProperty(localName = "date_enrolment")
        private String dateEnrolment;
        @JacksonXmlElementWrapper(localName = "health_condition_code")
        @JacksonXmlProperty(localName = "hc_code")
        private List<String> healthConditionCodes;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Contacts {
        @JacksonXmlElementWrapper(useWrapping = false)
        @JacksonXmlProperty(localName = "contact")
        private List<Contact> contactList;

        public Contact getScientificContact() {
            if (contactList == null) {
                return null;
            }
            return contactList.stream()
                    .filter(c -> "scientific".equalsIgnoreCase(c.getType()))
                    .findFirst()
                    .orElse(null);
        }
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Contact {
        @JacksonXmlProperty(localName = "type")
        private String type;
        @JacksonXmlProperty(localName = "firstname")
        private String firstname;
        @JacksonXmlProperty(localName = "lastname")
        private String lastname;
        @JacksonXmlProperty(localName = "address")
        private String address;
        @JacksonXmlProperty(localName = "city")
        private String city;
        @JacksonXmlProperty(localName = "zip")
        private String zip;
        @JacksonXmlProperty(localName = "telephone")
        private String telephone;
        @JacksonXmlProperty(localName = "email")
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
        @JacksonXmlProperty(localName = "gender")
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
}