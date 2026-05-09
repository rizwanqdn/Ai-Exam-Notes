// src/dummyData.js (or wherever your mock files live)

export const dummyNotesResponse = {
  // Simulating the outer response wrapper
  creditLeft: 15,
  data: {
    _id: "69fb8bd4c3accf74a9b86c98",
    user: "69f5b7b92dfb2a9529d2d9e7",
    topic: "web",
    classLevel: "10",
    examType: "neet",
    revisionMode: true,
    includeDiagram: "true",
    includeChart: "true",
    content: {
      subTopics: {
        "⭐": ["Web Browsers", "URL components"],
        "⭐⭐": ["HTTP and HTTPS", "Domain Name System"],
        "⭐⭐⭐": ["World Wide Web foundation", "Client-Server Architecture"],
      },
      importance: "⭐⭐⭐",
      notes:
        "### Web Basics for Exam\n- **WWW**: Information system where documents are identified by URLs.\n- **Client-Server**: Model where clients request and servers provide resources.\n- **DNS**: Translates domain names into IP addresses.\n- **HTTP/HTTPS**: Protocols for data communication; HTTPS includes SSL/TLS encryption.",
      revisionPoints: [
        "WWW: Global collection of interconnected documents.",
        "URL: Uniform Resource Locator (protocol + domain + path).",
        "HTTP: Port 80; HTTPS: Port 443 (secure).",
        "DNS: Phonebook of the internet.",
        "Client-Server: Request-response communication model.",
      ],
      questions: {
        short: ["Define URL.", "What is DNS?"],
        long: ["Explain the client-server interaction in the WWW."],
        diagram: "Flow of web request from client to server.",
      },
      diagram: {
        type: "graph",
        data: "graph TD\n[Client] --> [Request]\n[Request] --> [Internet]\n[Internet] --> [Server]\n[Server] --> [Response]\n[Response] --> [Client]",
      },
      charts: [
        {
          type: "pie",
          title: "Topic Weightage",
          data: [
            { name: "WWW", value: 40 },
            { name: "Protocols", value: 35 },
            { name: "DNS", value: 25 },
          ],
        },
      ],
    },
    createdAt: "2026-05-06T18:43:32.322Z",
    updatedAt: "2026-05-06T18:43:32.322Z",
    __v: 0,
  },
};
