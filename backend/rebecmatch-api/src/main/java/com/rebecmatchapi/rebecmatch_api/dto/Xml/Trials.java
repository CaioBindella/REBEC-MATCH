package com.rebecmatchapi.rebecmatch_api.dto.Xml;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import lombok.Data;
import java.util.List;

@Data
@JacksonXmlRootElement(localName = "root")
public class Trials {

    @JacksonXmlElementWrapper(localName = "trials")
    @JacksonXmlProperty(localName = "trial")
    private List<Trial> trials;
}