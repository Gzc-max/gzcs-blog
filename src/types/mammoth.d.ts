declare module 'mammoth' {
  interface ConvertOptions {
    arrayBuffer: ArrayBuffer
  }

  interface ConvertResult {
    value: string
    messages: any[]
  }

  export function convertToHtml(options: ConvertOptions): Promise<ConvertResult>
}
