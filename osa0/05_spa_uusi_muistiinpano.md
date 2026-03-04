sequenceDiagram
    participant browser
    participant server
    
    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    Note right of browser: The browser sends Note json data {content: "Hello", date: "2024-01-03T10:20:59.112Z"} to the server.
    activate server 
    server-->>browser: json response 
    Note right of server: The server sends back json message {"message":"note created"}
    deactivate server

    Note right of browser: When note is added, it is first pushed to spa app variable and then notes are rendered and then the note is sent to server.
    
    