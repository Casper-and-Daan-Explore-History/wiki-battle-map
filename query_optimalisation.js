//thgis file contains a hand written log of the queries and their info.

queries = [
    {
        url: "https://query.wikidata.org/#%23defaultView%3AImageGride%0ASELECT%20%0A%20%20%3FitemNew%20%3FitemNewLabel%20%3FitemNewDescription%20%3Farticle%0A%20%20%28SAMPLE%28%3Fgeo%29%20AS%20%3Fgeo%29%20%23%20The%20SAMPLE%20code%20is%20needed%20to%20inform%20the%20GROUP%20BY%20code%20what%20to%20do%20when%20there%20are%20more%20than%20one.%0A%20%20%28SAMPLE%28%3Fimg%29%20AS%20%3Fimg%29%0A%20%20%23%28SAMPLE%28%3Farticle%29%20AS%20%3Farticle%29%0A%20%20%28SAMPLE%28%3Fcategorie%29%20AS%20%3Fcategorie%29%0A%20%20%28GROUP_CONCAT%28%3FinstanceLabel%3B%20SEPARATOR%20%3D%20%22%2C%20%22%29%20AS%20%3Finstancesof%29%20%23%20a%20nices%20String%20with%20the%20labels%20of%20the%20different%20instances%20of%20related%20to%20the%20item%0A%20%20%23%28GROUP_CONCAT%28%3Fcategorie%3B%20SEPARATOR%20%3D%20%22%2C%20%22%29%20AS%20%3Fcategorie%29%0A%0AWHERE%20%7B%0A%20%20wd%3AQ243%20wdt%3AP625%20%3Floc.%0A%20%20%0A%20%20%23%23%23%23%20Selection%20based%20on%20location%20%23%23%23%23%0A%20%20SERVICE%20wikibase%3Aaround%20%7B%0A%20%20%20%20%3FitemNew%20wdt%3AP625%20%3Fgeo.%0A%20%20%20%20bd%3AserviceParam%20wikibase%3Acenter%20%3Floc%3B%0A%20%20%20%20%20%20wikibase%3Aradius%20%221%22.%20%23%20search%20radius%0A%20%20%7D%0A%0A%20%20%3FitemNew%20wdt%3AP18%20%3Fimg.%20%23%20Only%20keep%20items%20with%20pictures%0A%20%20MINUS%20%7B%20%3FitemNew%20%28wdt%3AP31%2F%28wdt%3AP279%2a%29%29%20wd%3AQ376799.%20%7D%20%23%20Remove%20everything%20related%20to%20roads%0A%0A%20%20%23%23%23%23%20Categorise%20items%20%23%23%23%23%0A%20%20BIND%28%0A%20%20%20%20IF%28EXISTS%20%7B%3FitemNew%20%28wdt%3AP31%2F%28wdt%3AP279%2a%29%29%20wd%3AQ811979%7D%2C%20%22Architectural%22%2C%0A%20%20%20%20IF%28EXISTS%20%7B%3FitemNew%20%28wdt%3AP31%2F%28wdt%3AP279%2a%29%29%20wd%3AQ1656682%7D%2C%20%22Event%22%2C%0A%20%20%20%20%20%20%22Other%22%0A%20%20%29%29%0A%20%20AS%20%3Fcategorie%29%0A%20%20%0A%20%20OPTIONAL%20%7B%20%3FitemNew%20wdt%3AP31%20%3Finstance.%20%7D%20%23%20Get%20instances%0A%20%20%0A%20%20%23%23%23%23%20Wikipedia%20link%20%23%23%23%23%0A%20%20OPTIONAL%20%7B%0A%20%20%20%20%3Farticle%20schema%3Aabout%20%3FitemNew%20.%20%23%20Get%20wikipedia%20link%0A%20%20%20%20%3Farticle%20schema%3AisPartOf%20%3Chttps%3A%2F%2Fen.wikipedia.org%2F%3E.%20%23%20Only%20keep%20EN%20language%0A%20%20%7D%0A%20%20%0A%20%20%23%23%23%23%20Labels%20%26%20discription%20%23%23%23%23%0A%20%20SERVICE%20wikibase%3Alabel%20%7B%20%23%20Get%20labels%0A%20%20%20%20bd%3AserviceParam%20wikibase%3Alanguage%20%22en%22.%20%0A%20%20%20%20%3Finstance%20rdfs%3Alabel%20%3FinstanceLabel.%20%20%20%20%20%20%23%20The%20specification%20of%20the%20variables%20to%20be%20labeld%20is%20needed%20for%20grouping%20the%20instances%20of%20correctly%0A%20%20%20%20%3FitemNew%20rdfs%3Alabel%20%3FitemNewLabel.%0A%20%20%20%20%3FitemNew%20schema%3Adescription%20%3FitemNewDescription.%0A%20%20%7D%0A%7D%0AGROUP%20BY%20%3FitemNew%20%3FitemNewLabel%20%3FitemNewDescription%20%3Farticle%0A",
        results: 174,
        time: [17996, 18243, 19589, 22537, 26062],
        note: "originial query"
    },
    {
        url: "https://query.wikidata.org/#%23defaultView%3AImageGride%0ASELECT%20%0A%20%20%3FitemNew%20%3FitemNewLabel%20%3FitemNewDescription%20%3Farticle%0A%20%20%28SAMPLE%28%3Fgeo%29%20AS%20%3Fgeo%29%20%23%20The%20SAMPLE%20code%20is%20needed%20to%20inform%20the%20GROUP%20BY%20code%20what%20to%20do%20when%20there%20are%20more%20than%20one.%0A%20%20%28SAMPLE%28%3Fimg%29%20AS%20%3Fimg%29%0A%20%20%23%28SAMPLE%28%3Farticle%29%20AS%20%3Farticle%29%0A%20%20%28SAMPLE%28%3Fcategorie%29%20AS%20%3Fcategorie%29%0A%20%20%28GROUP_CONCAT%28%3FinstanceLabel%3B%20SEPARATOR%20%3D%20%22%2C%20%22%29%20AS%20%3Finstancesof%29%20%23%20a%20nices%20String%20with%20the%20labels%20of%20the%20different%20instances%20of%20related%20to%20the%20item%0A%20%20%23%28GROUP_CONCAT%28%3Fcategorie%3B%20SEPARATOR%20%3D%20%22%2C%20%22%29%20AS%20%3Fcategorie%29%0A%0AWHERE%20%7B%0A%20%20wd%3AQ243%20wdt%3AP625%20%3Floc.%0A%20%20%0A%20%20%23%23%23%23%20Selection%20based%20on%20location%20%23%23%23%23%20%0A%20%20SERVICE%20wikibase%3Aaround%20%7B%0A%20%20%20%20%3FitemNew%20wdt%3AP625%20%3Fgeo.%0A%20%20%20%20bd%3AserviceParam%20wikibase%3Acenter%20%3Floc%3B%0A%20%20%20%20%20%20wikibase%3Aradius%20%221%22.%20%23%20search%20radius%20%0A%20%20%7D%0A%20%20%0A%20%20MINUS%20%7B%20%3FitemNew%20%28wdt%3AP31%2F%28wdt%3AP279%2a%29%29%20wd%3AQ376799.%20%7D%20%23%20Remove%20everything%20related%20to%20roads%0A%20%20%3FitemNew%20wdt%3AP18%20%3Fimg.%20%23%20Only%20keep%20items%20with%20pictures%20%0A%0A%20%20%23%23%23%23%20Categorise%20items%20%23%23%23%23%0A%20%20BIND%28%0A%20%20%20%20IF%28EXISTS%20%7B%3FitemNew%20%28wdt%3AP31%2F%28wdt%3AP279%2a%29%29%20wd%3AQ811979%7D%2C%20%22Architectural%22%2C%0A%20%20%20%20IF%28EXISTS%20%7B%3FitemNew%20%28wdt%3AP31%2F%28wdt%3AP279%2a%29%29%20wd%3AQ1656682%7D%2C%20%22Event%22%2C%0A%20%20%20%20%20%20%22Other%22%0A%20%20%29%29%0A%20%20AS%20%3Fcategorie%29%0A%20%20%0A%20%20OPTIONAL%20%7B%20%3FitemNew%20wdt%3AP31%20%3Finstance.%20%7D%20%23%20Get%20instances%0A%20%20%0A%20%20%23%23%23%23%20Wikipedia%20link%20%23%23%23%23%0A%20%20OPTIONAL%20%7B%0A%20%20%20%20%3Farticle%20schema%3Aabout%20%3FitemNew%20.%20%23%20Get%20wikipedia%20link%0A%20%20%20%20%3Farticle%20schema%3AisPartOf%20%3Chttps%3A%2F%2Fen.wikipedia.org%2F%3E.%20%23%20Only%20keep%20EN%20language%0A%20%20%7D%0A%20%20%0A%20%20%23%23%23%23%20Labels%20%26%20discription%20%23%23%23%23%0A%20%20SERVICE%20wikibase%3Alabel%20%7B%20%23%20Get%20labels%0A%20%20%20%20bd%3AserviceParam%20wikibase%3Alanguage%20%22en%22.%20%0A%20%20%20%20%3Finstance%20rdfs%3Alabel%20%3FinstanceLabel.%20%20%20%20%20%20%23%20The%20specification%20of%20the%20variables%20to%20be%20labeld%20is%20needed%20for%20grouping%20the%20instances%20of%20correctly%0A%20%20%20%20%3FitemNew%20rdfs%3Alabel%20%3FitemNewLabel.%0A%20%20%20%20%3FitemNew%20schema%3Adescription%20%3FitemNewDescription.%0A%20%20%7D%0A%7D%0AGROUP%20BY%20%3FitemNew%20%3FitemNewLabel%20%3FitemNewDescription%20%3Farticle%0A",
        results: 174,
        time: [12767, 12940, 16364, 17625, 18557, 18853, 19342],
        note: "switched filter, and Minus" 
    },
    {
        url: "https://query.wikidata.org/#SELECT%20%3FitemNew%20%3FitemNewLabel%20%3FitemNewDescription%20%3Farticle%20%28SAMPLE%28%3Fgeo%29%20AS%20%3Fgeo%29%20%28SAMPLE%28%3Fimg%29%20AS%20%3Fimg%29%20%28SAMPLE%28%3Fcategorie%29%20AS%20%3Fcategorie%29%20%28GROUP_CONCAT%28%3FinstanceLabel%3B%20SEPARATOR%20%3D%20%22%2C%20%22%29%20AS%20%3Finstancesof%29%20WHERE%20%7Bwd%3AQ243%20wdt%3AP625%20%3Floc.SERVICE%20wikibase%3Aaround%20%7B%3FitemNew%20wdt%3AP625%20%3Fgeo.bd%3AserviceParam%20wikibase%3Acenter%20%3Floc%3Bwikibase%3Aradius%20%221%22.%7DMINUS%20%7B%20%3FitemNew%20%28wdt%3AP31%2F%28wdt%3AP279%2a%29%29%20wd%3AQ376799.%20%7D%3FitemNew%20wdt%3AP18%20%3Fimg.BIND%28IF%28EXISTS%20%7B%20%3FitemNew%20%28wdt%3AP31%2F%28wdt%3AP279%2a%29%29%20wd%3AQ811979.%20%7D%2C%20%22Architectural%22%2C%20IF%28EXISTS%20%7B%20%3FitemNew%20%28wdt%3AP31%2F%28wdt%3AP279%2a%29%29%20wd%3AQ1656682.%20%7D%2C%20%22Event%22%2C%20%22Other%22%29%29%20AS%20%3Fcategorie%29OPTIONAL%20%7B%3FitemNew%20wdt%3AP31%20%3Finstance.%7DOPTIONAL%20%7B%3Farticle%20schema%3Aabout%20%3FitemNew%3Bschema%3AisPartOf%20%3Chttps%3A%2F%2Fen.wikipedia.org%2F%3E.%7DSERVICE%20wikibase%3Alabel%20%7Bbd%3AserviceParam%20wikibase%3Alanguage%20%22en%22.%3Finstance%20rdfs%3Alabel%20%3FinstanceLabel.%3FitemNew%20rdfs%3Alabel%20%3FitemNewLabel%3Bschema%3Adescription%20%3FitemNewDescription.%7D%7DGROUP%20BY%20%3FitemNew%20%3FitemNewLabel%20%3FitemNewDescription%20%3Farticle",
        results: 174,
        time: [15802, 18051, 26789],
        note: "Compacted"
    },
    {
        url: "https://query.wikidata.org/#%23defaultView%3AImageGride%0ASELECT%20%3FitemNew%20%3FitemNewLabel%20%3FitemNewDescription%20%3Farticle%20%28SAMPLE%28%3Fgeo%29%20AS%20%3Fgeo%29%20%28SAMPLE%28%3Fimg%29%20AS%20%3Fimg%29%20%28SAMPLE%28%3Fcategorie%29%20AS%20%3Fcategorie%29%20%28GROUP_CONCAT%28%3FinstanceLabel%3B%20SEPARATOR%20%3D%20%22%2C%20%22%29%20AS%20%3Finstancesof%29%20WHERE%20%7B%0A%20%20wd%3AQ243%20wdt%3AP625%20%3Floc.%0A%20%20SERVICE%20wikibase%3Aaround%20%7B%3FitemNew%20wdt%3AP625%20%3Fgeo.bd%3AserviceParam%20wikibase%3Acenter%20%3Floc%3Bwikibase%3Aradius%20%221%22.%7D%0A%20%20MINUS%20%7B%20%3FitemNew%20%28wdt%3AP31%2F%28wdt%3AP279%2a%29%29%20wd%3AQ376799.%20%7D%0A%20%20%3FitemNew%20wdt%3AP18%20%3Fimg.%0A%20%20BIND%28IF%28EXISTS%20%7B%20%3FitemNew%20%28wdt%3AP31%2F%28wdt%3AP279%2a%29%29%20wd%3AQ811979.%20%7D%2C%20%22Architectural%22%2C%20IF%28EXISTS%20%7B%20%3FitemNew%20%28wdt%3AP31%2F%28wdt%3AP279%2a%29%29%20wd%3AQ1656682.%20%7D%2C%20%22Event%22%2C%20%22Other%22%29%29%20AS%20%3Fcategorie%29%0A%20%20OPTIONAL%20%7B%3FitemNew%20wdt%3AP31%20%3Finstance.%7D%0A%20%20OPTIONAL%20%7B%3Farticle%20schema%3Aabout%20%3FitemNew%3Bschema%3AisPartOf%20%3Chttps%3A%2F%2Fen.wikipedia.org%2F%3E.%7D%0A%20%20SERVICE%20wikibase%3Alabel%20%7Bbd%3AserviceParam%20wikibase%3Alanguage%20%22en%22.%3Finstance%20rdfs%3Alabel%20%3FinstanceLabel.%3FitemNew%20rdfs%3Alabel%20%3FitemNewLabel%3Bschema%3Adescription%20%3FitemNewDescription.%7D%0A%7DGROUP%20BY%20%3FitemNew%20%3FitemNewLabel%20%3FitemNewDescription%20%3Farticle",
        results: 174,
        time: [17527, 21683],
        note: "The entire query on one line."
    },
    {
        url: "https://query.wikidata.org/#%23defaultView%3AImageGride%0ASELECT%20%0A%20%20%3FitemNew%20%3FitemNewLabel%20%3FitemNewDescription%20%3Farticle%0A%20%20%28SAMPLE%28%3Fgeo%29%20AS%20%3Fgeo%29%20%23%20The%20SAMPLE%20code%20is%20needed%20to%20inform%20the%20GROUP%20BY%20code%20what%20to%20do%20when%20there%20are%20more%20than%20one.%0A%20%20%28SAMPLE%28%3Fimg%29%20AS%20%3Fimg%29%0A%20%20%28SAMPLE%28%3Fcategorie%29%20AS%20%3Fcategorie%29%0A%20%20%28GROUP_CONCAT%28%3FinstanceLabel%3B%20SEPARATOR%20%3D%20%22%2C%20%22%29%20AS%20%3Finstancesof%29%20%23%20a%20nices%20String%20with%20the%20labels%20of%20the%20different%20instances%20of%20related%20to%20the%20item%0A%0AWHERE%20%7B%0A%20%20%23wd%3AQ243%20wdt%3AP625%20%3Floc.%0A%20%20%0A%20%20%23%23%23%23%20Selection%20based%20on%20location%20%23%23%23%23%20%0A%20%20%23SERVICE%20wikibase%3Aaround%20%7B%0A%20%20%23%20%20%3FitemNew%20wdt%3AP625%20%3Fgeo.%0A%20%20%23%20%20bd%3AserviceParam%20wikibase%3Acenter%20%3Floc%3B%0A%20%20%23%20%20%20%20wikibase%3Aradius%20%221%22.%20%23%20search%20radius%20%0A%20%20%23%7D%0A%20%20%0A%20%20SERVICE%20wikibase%3Abox%20%7B%0A%20%20%20%20%3FitemNew%20wdt%3AP625%20%3Fgeo.%0A%20%20%20%20bd%3AserviceParam%20wikibase%3AcornerWest%20%22Point%282.292525%2048.875076%29%22%5E%5Egeo%3AwktLiteral.%20%0A%20%20%20%20bd%3AserviceParam%20wikibase%3AcornerEast%20%22Point%282.352318%2048.851816%29%22%5E%5Egeo%3AwktLiteral.%0A%20%20%7D%0A%20%20%0A%20%20MINUS%20%7B%20%3FitemNew%20%28wdt%3AP31%2F%28wdt%3AP279%2a%29%29%20wd%3AQ376799.%20%7D%20%23%20Remove%20everything%20related%20to%20roads%0A%20%20%3FitemNew%20wdt%3AP18%20%3Fimg.%20%23%20Only%20keep%20items%20with%20pictures%20%0A%0A%20%20%23%23%23%23%20Categorise%20items%20%23%23%23%23%0A%20%20BIND%28%0A%20%20%20%20IF%28EXISTS%20%7B%3FitemNew%20%28wdt%3AP31%2F%28wdt%3AP279%2a%29%29%20wd%3AQ811979%7D%2C%20%22Architectural%22%2C%0A%20%20%20%20IF%28EXISTS%20%7B%3FitemNew%20%28wdt%3AP31%2F%28wdt%3AP279%2a%29%29%20wd%3AQ1656682%7D%2C%20%22Event%22%2C%0A%20%20%20%20%20%20%22Other%22%0A%20%20%29%29%0A%20%20AS%20%3Fcategorie%29%0A%20%20%0A%20%20OPTIONAL%20%7B%20%3FitemNew%20wdt%3AP31%20%3Finstance.%20%7D%20%23%20Get%20instances%0A%20%20%0A%20%20%23%23%23%23%20Wikipedia%20link%20%23%23%23%23%0A%20%20OPTIONAL%20%7B%0A%20%20%20%20%3Farticle%20schema%3Aabout%20%3FitemNew%20.%20%23%20Get%20wikipedia%20link%0A%20%20%20%20%3Farticle%20schema%3AisPartOf%20%3Chttps%3A%2F%2Fen.wikipedia.org%2F%3E.%20%23%20Only%20keep%20EN%20language%0A%20%20%7D%0A%20%20%0A%20%20%23%23%23%23%20Labels%20%26%20discription%20%23%23%23%23%0A%20%20SERVICE%20wikibase%3Alabel%20%7B%20%23%20Get%20labels%0A%20%20%20%20bd%3AserviceParam%20wikibase%3Alanguage%20%22en%22.%20%0A%20%20%20%20%3Finstance%20rdfs%3Alabel%20%3FinstanceLabel.%20%20%20%20%20%20%23%20The%20specification%20of%20the%20variables%20to%20be%20labeld%20is%20needed%20for%20grouping%20the%20instances%20of%20correctly%0A%20%20%20%20%3FitemNew%20rdfs%3Alabel%20%3FitemNewLabel.%0A%20%20%20%20%3FitemNew%20schema%3Adescription%20%3FitemNewDescription.%0A%20%20%7D%0A%7D%0AGROUP%20BY%20%3FitemNew%20%3FitemNewLabel%20%3FitemNewDescription%20%3Farticle%0A",
        results: 1818,
        time: [36812, ]
    },
    {
        url: "",
        results: 0,
        time: 0
    },
    {
        date: "25 nov 2020",
        url: "https://query.wikidata.org/#%23defaultView%3AImageGride%0ASELECT%0A%20%20%3FitemNew%20%3FitemNewLabel%20%3FitemNewDescription%0A%20%20%3Fgeo%20%3Fimg%20%3Fcategorie%0A%20%20%28GROUP_CONCAT%28%3FinstanceLabel%3B%20SEPARATOR%20%3D%20%22%2C%20%22%29%20AS%20%3Finstancesof%29%20%23%20a%20nices%20String%20with%20the%20labels%20of%20the%20different%20instances%20of%20related%20to%20the%20item%0AWITH%0A%7B%0A%20%20SELECT%20%0A%20%20%20%20%3FitemNew%20%0A%20%20%20%20%28SAMPLE%28%3Fgeo_%29%20AS%20%3Fgeo%29%20%23%20The%20SAMPLE%20code%20is%20needed%20to%20inform%20the%20GROUP%20BY%20code%20what%20to%20do%20when%20there%20are%20more%20than%20one.%0A%20%20%20%20%28SAMPLE%28%3Fimg_%29%20AS%20%3Fimg%29%0A%20%20WHERE%0A%20%20%7B%0A%20%20%20%20%23%23%23%23%20Selection%20based%20on%20location%20%23%23%23%23%20%20%20%0A%20%20%20%20SERVICE%20wikibase%3Abox%0A%20%20%20%20%7B%0A%20%20%20%20%20%20%3FitemNew%20wdt%3AP625%20%3Fgeo_.%0A%20%20%20%20%20%20bd%3AserviceParam%20wikibase%3AcornerWest%20%22Point%282.30%2048.87%29%22%5E%5Egeo%3AwktLiteral.%20%0A%20%20%20%20%20%20bd%3AserviceParam%20wikibase%3AcornerEast%20%22Point%282.32%2048.86%29%22%5E%5Egeo%3AwktLiteral.%0A%20%20%20%20%7D%0A%0A%20%20%20%20MINUS%20%7B%20%3FitemNew%20%28wdt%3AP31%2F%28wdt%3AP279%2a%29%29%20wd%3AQ376799.%20%7D%20%23%20Remove%20everything%20related%20to%20roads%0A%20%20%20%20%3FitemNew%20wdt%3AP18%20%3Fimg_.%20%23%20Only%20keep%20items%20with%20pictures%0A%20%20%7D%0A%20%20GROUP%20BY%20%3FitemNew%0A%7D%20AS%20%25get_items%0AWHERE%0A%7B%0A%20%20INCLUDE%20%25get_items%0A%0A%20%20%23%23%23%23%20Categorise%20items%20%23%23%23%23%0A%20%20BIND%28%0A%20%20%20%20IF%28EXISTS%20%7B%3FitemNew%20%28wdt%3AP31%2F%28wdt%3AP279%2a%29%29%20wd%3AQ811979%7D%2C%0A%20%20%20%20%20%20%20%22Architectural%22%2C%0A%20%20%20%20%20%20%20IF%28EXISTS%20%7B%3FitemNew%20%28wdt%3AP31%2F%28wdt%3AP279%2a%29%29%20wd%3AQ1656682%7D%2C%0A%20%20%20%20%20%20%20%20%20%20%22Event%22%2C%0A%20%20%20%20%20%20%20%20%20%20%22Other%22%0A%20%20%20%20%20%20%20%20%20%29%0A%20%20%20%20%20%20%29%0A%20%20AS%20%3Fcategorie%29%0A%20%20%0A%20%20OPTIONAL%20%7B%20%3FitemNew%20wdt%3AP31%20%3Finstance.%20%7D%20%23%20Get%20instances%0A%20%20%20%0A%20%20%23%23%23%23%20Wikipedia%20link%20%23%23%23%23%0A%20%20OPTIONAL%20%7B%0A%20%20%20%20%3Farticle%20schema%3Aabout%20%3FitemNew%20.%20%23%20Get%20wikipedia%20link%0A%20%20%20%20%3Farticle%20schema%3AisPartOf%20%3Chttps%3A%2F%2Fen.wikipedia.org%2F%3E.%20%23%20Only%20keep%20EN%20language%0A%20%20%7D%0A%20%20%0A%20%20%23%23%23%23%20Labels%20%26%20discription%20%23%23%23%23%20%0A%20%20SERVICE%20wikibase%3Alabel%20%7B%20%23%20Get%20labels%0A%20%20%20%20bd%3AserviceParam%20wikibase%3Alanguage%20%22en%22.%20%0A%20%20%20%20%3Finstance%20rdfs%3Alabel%20%3FinstanceLabel.%20%20%20%20%20%20%23%20The%20specification%20of%20the%20variables%20to%20be%20labeld%20is%20needed%20for%20grouping%20the%20instances%20of%20correctly%0A%20%20%20%20%3FitemNew%20rdfs%3Alabel%20%3FitemNewLabel.%0A%20%20%20%20%3FitemNew%20schema%3Adescription%20%3FitemNewDescription.%0A%20%20%7D%0A%7D%0AGROUP%20BY%20%3FitemNew%20%3FitemNewLabel%20%3FitemNewDescription%20%3Fgeo%20%3Fimg%20%3Fcategorie%20%3Farticle",
        note: "with category",
        results: 150,
        time: [12414]
    },
    {
        date: "25 nov 2020",
        url: "https://query.wikidata.org/#%23defaultView%3AImageGride%0ASELECT%0A%20%20%3FitemNew%20%3FitemNewLabel%20%3FitemNewDescription%0A%20%20%3Fgeo%20%3Fimg%20%3Fcategorie%0A%20%20%28GROUP_CONCAT%28%3FinstanceLabel%3B%20SEPARATOR%20%3D%20%22%2C%20%22%29%20AS%20%3Finstancesof%29%20%23%20a%20nices%20String%20with%20the%20labels%20of%20the%20different%20instances%20of%20related%20to%20the%20item%0AWITH%0A%7B%0A%20%20SELECT%20%0A%20%20%20%20%3FitemNew%20%0A%20%20%20%20%28SAMPLE%28%3Fgeo_%29%20AS%20%3Fgeo%29%20%23%20The%20SAMPLE%20code%20is%20needed%20to%20inform%20the%20GROUP%20BY%20code%20what%20to%20do%20when%20there%20are%20more%20than%20one.%0A%20%20%20%20%28SAMPLE%28%3Fimg_%29%20AS%20%3Fimg%29%0A%20%20WHERE%0A%20%20%7B%0A%20%20%20%20%23%23%23%23%20Selection%20based%20on%20location%20%23%23%23%23%20%20%20%0A%20%20%20%20SERVICE%20wikibase%3Abox%0A%20%20%20%20%7B%0A%20%20%20%20%20%20%3FitemNew%20wdt%3AP625%20%3Fgeo_.%0A%20%20%20%20%20%20bd%3AserviceParam%20wikibase%3AcornerWest%20%22Point%282.30%2048.87%29%22%5E%5Egeo%3AwktLiteral.%20%0A%20%20%20%20%20%20bd%3AserviceParam%20wikibase%3AcornerEast%20%22Point%282.32%2048.86%29%22%5E%5Egeo%3AwktLiteral.%0A%20%20%20%20%7D%0A%0A%20%20%20%20MINUS%20%7B%20%3FitemNew%20%28wdt%3AP31%2F%28wdt%3AP279%2a%29%29%20wd%3AQ376799.%20%7D%20%23%20Remove%20everything%20related%20to%20roads%0A%20%20%20%20%3FitemNew%20wdt%3AP18%20%3Fimg_.%20%23%20Only%20keep%20items%20with%20pictures%0A%20%20%7D%0A%20%20GROUP%20BY%20%3FitemNew%0A%7D%20AS%20%25get_items%0AWHERE%0A%7B%0A%20%20INCLUDE%20%25get_items%0A%20%20%0A%20%20OPTIONAL%20%7B%20%3FitemNew%20wdt%3AP31%20%3Finstance.%20%7D%20%23%20Get%20instances%0A%20%20%20%0A%20%20%23%23%23%23%20Wikipedia%20link%20%23%23%23%23%0A%20%20OPTIONAL%20%7B%0A%20%20%20%20%3Farticle%20schema%3Aabout%20%3FitemNew%20.%20%23%20Get%20wikipedia%20link%0A%20%20%20%20%3Farticle%20schema%3AisPartOf%20%3Chttps%3A%2F%2Fen.wikipedia.org%2F%3E.%20%23%20Only%20keep%20EN%20language%0A%20%20%7D%0A%20%20%0A%20%20%23%23%23%23%20Labels%20%26%20discription%20%23%23%23%23%20%0A%20%20SERVICE%20wikibase%3Alabel%20%7B%20%23%20Get%20labels%0A%20%20%20%20bd%3AserviceParam%20wikibase%3Alanguage%20%22en%22.%20%0A%20%20%20%20%3Finstance%20rdfs%3Alabel%20%3FinstanceLabel.%20%20%20%20%20%20%23%20The%20specification%20of%20the%20variables%20to%20be%20labeld%20is%20needed%20for%20grouping%20the%20instances%20of%20correctly%0A%20%20%20%20%3FitemNew%20rdfs%3Alabel%20%3FitemNewLabel.%0A%20%20%20%20%3FitemNew%20schema%3Adescription%20%3FitemNewDescription.%0A%20%20%7D%0A%7D%0AGROUP%20BY%20%3FitemNew%20%3FitemNewLabel%20%3FitemNewDescription%20%3Fgeo%20%3Fimg%20%3Fcategorie%20%3Farticle",
        note: "without category",
        results: 150,
        time: [2700, 2400, 3169]
    },
    {
        url: "",
        note: "",
        results: 0,
        time: [0]
    },
    {
        date: "25 nov 2020",
        url: "https://query.wikidata.org/#SELECT%20%0A%20%20%20%20%3Fitem%0A%20%20%20%20%3Fgeo%20%0A%20%20%20%20%3Fimg%0AWHERE%0A%7B%0A%20%20SERVICE%20wikibase%3Abox%7B%0A%20%20%20%20%3Fitem%20wdt%3AP625%20%3Fgeo.%0A%20%20%20%20bd%3AserviceParam%20wikibase%3AcornerWest%20%22Point%282.30%2048.87%29%22%5E%5Egeo%3AwktLiteral.%20%0A%20%20%20%20bd%3AserviceParam%20wikibase%3AcornerEast%20%22Point%282.32%2048.86%29%22%5E%5Egeo%3AwktLiteral.%0A%20%20%7D%0A%20%20MINUS%20%7B%20%3Fitem%20%28wdt%3AP31%2F%28wdt%3AP279%2a%29%29%20wd%3AQ376799.%20%7D%20%23%20Remove%20everything%20related%20to%20roads%0A%20%20%3Fitem%20wdt%3AP18%20%3Fimg.%20%23%20Only%20keep%20items%20with%20pictures%20d%0A%7D%0A",
        note: "Mini query incl. MINUS streets",
        results: 154,
        time: [2017, 1976, 2467]
    },
    {
        date: "25 nov 2020",
        url: "https://query.wikidata.org/#SELECT%20%0A%20%20%20%20%3Fitem%0A%20%20%20%20%3Fgeo%20%0A%20%20%20%20%3Fimg%0AWHERE%0A%7B%0A%20%20SERVICE%20wikibase%3Abox%7B%0A%20%20%20%20%3Fitem%20wdt%3AP625%20%3Fgeo.%0A%20%20%20%20bd%3AserviceParam%20wikibase%3AcornerWest%20%22Point%282.30%2048.87%29%22%5E%5Egeo%3AwktLiteral.%20%0A%20%20%20%20bd%3AserviceParam%20wikibase%3AcornerEast%20%22Point%282.32%2048.86%29%22%5E%5Egeo%3AwktLiteral.%0A%20%20%7D%0A%20%20%23MINUS%20%7B%20%3Fitem%20%28wdt%3AP31%2F%28wdt%3AP279%2a%29%29%20wd%3AQ376799.%20%7D%20%23%20Remove%20everything%20related%20to%20roads%0A%20%20%3Fitem%20wdt%3AP18%20%3Fimg.%20%23%20Only%20keep%20items%20with%20pictures%20d%20%20%0A%7D%0A",
        note: "Mini query excl. MINUS streets",
        results: 230,
        time: [402, 954, 621]
    },
    {
        url: "",
        note: "",
        results: 0,
        time: [0]
    },
    {
        url: "https://query.wikidata.org/#%23defaultView%3AImageGride%0ASELECT%0A%20%20%3FitemNew%20%3FitemNewLabel%20%3FitemNewDescription%0A%20%20%3Fgeo%20%3Fimg%0A%23%20%20%28GROUP_CONCAT%28%3FinstanceLabel%3B%20SEPARATOR%20%3D%20%22%2C%20%22%29%20AS%20%3Finstancesof%29%20%23%20a%20nices%20String%20with%20the%20labels%20of%20the%20different%20instances%20of%20related%20to%20the%20item%0A%20%20%28group_concat%28%3FinstanceLabel%3Bseparator%3D%22%20-%20%22%29%20as%20%3Finstancesof%29%0AWITH%0A%7B%0A%20%20SELECT%20%0A%20%20%20%20%3FitemNew%20%0A%20%20%20%20%28SAMPLE%28%3Fgeo_%29%20AS%20%3Fgeo%29%20%23%20The%20SAMPLE%20code%20is%20needed%20to%20inform%20the%20GROUP%20BY%20code%20what%20to%20do%20when%20there%20are%20more%20than%20one.%0A%20%20%20%20%28SAMPLE%28%3Fimg_%29%20AS%20%3Fimg%29%0A%20%20WHERE%0A%20%20%7B%0A%20%20%20%20%23%23%23%23%20Selection%20based%20on%20location%20%23%23%23%23%20%20%20%0A%20%20%20%20SERVICE%20wikibase%3Abox%0A%20%20%20%20%7B%0A%20%20%20%20%20%20%3FitemNew%20wdt%3AP625%20%3Fgeo_.%0A%20%20%20%20%20%20bd%3AserviceParam%20wikibase%3AcornerWest%20%22Point%282.30%2048.87%29%22%5E%5Egeo%3AwktLiteral.%20%0A%20%20%20%20%20%20bd%3AserviceParam%20wikibase%3AcornerEast%20%22Point%282.32%2048.86%29%22%5E%5Egeo%3AwktLiteral.%0A%20%20%20%20%7D%0A%0A%20%20%20%20%23MINUS%20%7B%20%3FitemNew%20%28wdt%3AP31%2F%28wdt%3AP279%2a%29%29%20wd%3AQ376799.%20%7D%20%23%20Remove%20everything%20related%20to%20roads%0A%20%20%20%20%3FitemNew%20wdt%3AP18%20%3Fimg_.%20%23%20Only%20keep%20items%20with%20pictures%0A%20%20%7D%0A%20%20GROUP%20BY%20%3FitemNew%0A%7D%20AS%20%25get_items%0AWHERE%0A%7B%0A%20%20INCLUDE%20%25get_items%20%0A%20%20%0A%20%20OPTIONAL%20%7B%20%3FitemNew%20wdt%3AP31%20%3Finstance.%20%7D%20%23%20Get%20instances%20%0A%20%20%20%0A%20%20%23%23%23%23%20Wikipedia%20link%20%23%23%23%23%0A%20%20OPTIONAL%20%7B%0A%20%20%20%20%3Farticle%20schema%3Aabout%20%3FitemNew%20.%20%23%20Get%20wikipedia%20link%0A%20%20%20%20%3Farticle%20schema%3AisPartOf%20%3Chttps%3A%2F%2Fen.wikipedia.org%2F%3E.%20%23%20Only%20keep%20EN%20language%0A%20%20%7D%0A%20%20%0A%20%20%23%23%23%23%20Labels%20%26%20discription%20%23%23%23%23%20%0A%20%20SERVICE%20wikibase%3Alabel%20%7B%20%23%20Get%20labels%0A%20%20%20%20bd%3AserviceParam%20wikibase%3Alanguage%20%22en%22.%20%0A%20%20%20%20%3Finstance%20rdfs%3Alabel%20%3FinstanceLabel.%20%20%20%20%20%20%23%20The%20specification%20of%20the%20variables%20to%20be%20labeld%20is%20needed%20for%20grouping%20the%20instances%20of%20correctly%0A%20%20%20%20%3FitemNew%20rdfs%3Alabel%20%3FitemNewLabel.%0A%20%20%20%20%3FitemNew%20schema%3Adescription%20%3FitemNewDescription.%0A%20%20%7D%0A%7D%0AGROUP%20BY%20%3FitemNew%20%3FitemNewLabel%20%3FitemNewDescription%20%3Fgeo%20%3Fimg%20%3Farticle",
        note: "Big query. no MINUS and no category",
        results: 219,
        time: [1964, 2153, 1339, 1207]
    }
]

