/**
 * Convert base64 to blob
 */
export async function b64toBlob(b64Data: string) {
  return fetch(b64Data).then((res) => res.blob())
}

/**
 * Trigger download popup
 * @param filename filename
 * @param blob file content
 */
export function download(filename: string, blob: Blob) {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
}

/**
 * Convert image url to base64
 * https://stackoverflow.com/questions/6150289/how-can-i-convert-an-image-into-base64-string-using-javascript
 */
export async function toDataURL(src: string): Promise<string> {
  return new Promise((resolve) => {
    var img = new Image()
    img.crossOrigin = 'Anonymous'
    img.onload = function () {
      var canvas = document.createElement('canvas')
      var ctx = canvas.getContext('2d') as CanvasRenderingContext2D
      var dataURL
      canvas.height = img.height
      canvas.width = img.width
      ctx.drawImage(img, 0, 0)
      dataURL = canvas.toDataURL('image/png')
      resolve(dataURL)
    }
    img.src = src
    if (img.complete || img.complete === undefined) {
      img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='
      img.src = src
    }
  })
}
