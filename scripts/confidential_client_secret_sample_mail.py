import re
import sys
import json
import logging
import requests
import msal
import html


def slugify(str_: str):
    slug = re.sub(r"[^A-z0-9-]", "_", str_)
    return slug

config = json.load(open(sys.argv[1]))

app = msal.ConfidentialClientApplication(
    config["client_id"],
    authority=config["authority"],
    client_credential=config["secret"],
)
result = None


if not result:
    logging.info("No suitable token exists in cache. Let's get a new one from AAD.")
    result = app.acquire_token_for_client(scopes=config["scope"])

if "access_token" in result:
    graph_data = requests.get(  
        config["endpoint"] + "/mobile@Paxis.org/messages?",
        headers={"Authorization": "Bearer " + result["access_token"]},
    ).json()
    print("Graph API call result: ")
    with open("sample.json", "w", encoding="utf-8") as outfile:
        outfile.write(json.dumps(graph_data, indent=2))

    odata_context = graph_data["@odata.context"]
    odata_nextLink = graph_data["@odata.nextLink"]

    for mail in graph_data["value"]:
        with open(
            "out/{}.{}".format(
                slugify(
                    "{}_{}".format(
                        mail["subject"],
                        mail["sentDateTime"],
                    )
                ),
                mail["body"]["contentType"],
            ),
            "w",
            encoding="utf-8",
        ) as outfile:
            outfile.write(html.unescape(mail["body"]["content"]))

else:
    print(result.get("error"))
    print(result.get("error_description"))
    print(result.get("correlation_id"))  
