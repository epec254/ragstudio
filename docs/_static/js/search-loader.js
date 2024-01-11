(function (config) {
  /**
   * Loads scripts and adds them to the DOM
   * @param {string} src
   * @param {Event} callback
   */
  function loadScript(url, callback) {
    // Create a new script element
    const script = document.createElement("script");
    script.setAttributeNode(document.createAttribute("data-ot-ignore"));
    script.type = "text/javascript";

    // If callback is provided, set it as the onload listener
    if (callback) {
      script.onload = function () {
        callback(null, script);
      };

      script.onerror = function () {
        callback(new Error("Failed to load the script: " + url));
      };
    }

    // Set the script's source and append it to the head
    script.src = url;
    document.body.appendChild(script);
  }

  /**
   * Loads resources needed for searchunify search client
   * @param {string} id
   */
  function loadSearchUnifyResourcesById(id) {
    const baseUrl = "https://databricks.searchunify.com/resources/";
    // Analytics script contains scConfiguration object which is used by other scripts
    loadScript(
      baseUrl + "search_clients_custom/" + id + "/external_scripts.js"
    );
    const analyticUrl = "search_clients_custom/" + id + "/an.js";
    loadScript(baseUrl + analyticUrl, function (err) {
      if (!err) {
        loadScript(baseUrl + "search_clients_custom/" + id + "/searchbox.js");
        loadScript(baseUrl + "search_clients_custom/" + id + "/feedback.js");
        if (window.location.pathname.includes("search.html")) {
          loadScript(baseUrl + "search_clients_custom/" + id + "/main.js");
        }
      }
    });
  }

  /**
   * Loads resources needed for searchunify search client
   * @param {Record<string,string>} clientIdMap
   */
  function loadSearchUnifyLocalizedVersion(clientIdMap) {
    const localizationCode = window.location.pathname.split("/")[1];
    const clientId = clientIdMap[localizationCode] || clientIdMap["en"];
    if (clientId) {
      loadSearchUnifyResourcesById(clientId);
    }
  }

  loadSearchUnifyLocalizedVersion(config.clients);
})(window.__searchunifyLoaderConfig);
