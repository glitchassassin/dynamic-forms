Next Steps

- [x] Persist form submission in Mongo
- [x] Use jsonschema-form for the form that edits the schemas
- [x] Add UI schema
- [x] Server-side schema validation
  - [x] Return extraErrors from action? Test with different schemas on frontend/backend (required on one, not on the other)
- [x] Custom validation methods
  - [x] Define a routing number validator https://en.wikipedia.org/wiki/ABA_routing_transit_number#Check_digit.
- [ ] Admin form editor

---

What happens when a schema changes?

- A new field is added
  - The field appears on the document once the form has been saved
- A field is removed
  - The field disappears from the document once the form has been saved
- A field is changed
  - The old field value is lost when the form is edited and saved

I don't think we're actually really handling this differently now. As long as we track the version of the schema that was used when saving the document, users just have to be aware of changes that will lose data.
