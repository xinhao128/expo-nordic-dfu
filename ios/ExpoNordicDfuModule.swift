import ExpoModulesCore

public class ExpoNordicDfuModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoNordicDfuModule")

    Events("DFUStateChanged", "DFUProgress")

    OnStartObserving {
      // This is called when the module starts observing events.
      // You can start listening to events here.
    }

    OnStopObserving {
      // This is called when the module stops observing events.
      // You can stop listening to events here.
    }

    AsyncFunction("startIosDfu") { (promise: Promise) in
      UserDefaults.standard.string(forKey: "theme") ?? Theme.system.rawValue
    }

    AsyncFunction("abordIosDfu") { (promise: Promise) in
      UserDefaults.standard.string(forKey: "theme") ?? Theme.system.rawValue
    }

    // Enables the module to be used as a native view. Definition components that are accepted as part of the
    // view definition: Prop, Events.
    // View(ExpoNordicDfuView.self) {
    //   // Defines a setter for the `url` prop.
    //   Prop("url") { (view: ExpoNordicDfuView, url: URL) in
    //     if view.webView.url != url {
    //       view.webView.load(URLRequest(url: url))
    //     }
    //   }

    //   Events("onLoad")
    // }
  }
}
