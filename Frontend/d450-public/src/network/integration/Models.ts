export interface Adapters {
  id: string;
  adaptersProperties: { 
    [adapterKey: string] : AdapterSettings;
  }
}

export interface AdapterSettings {
  [adapterSetting: string] : any
}