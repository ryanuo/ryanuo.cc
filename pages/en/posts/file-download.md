---
title: File suffix issue when Chrome downloads files
date: 2023-10-01 09:09:09
description: File suffix issue when Chrome downloads files
---

[[toc]]

### Problem Description

When handling Blob files and triggering downloads, if the file name specified for download does not include a file suffix, the downloaded file may lack an extension, which can affect its recognizability and usability.

### Default Browser Behavior

- When a browser detects that the file name includes a suffix during download, it usually does not modify or process the file name.
- The browser determines whether the file name includes a suffix by checking if there is a decimal part (i.e., file extension) after a dot (.) in the file name. If such a decimal part exists, the browser will not automatically append a suffix.

If the file name does not explicitly include a suffix, the browser may automatically append one based on the following scenarios:

1. HTTP Response Content-Disposition Header
   If the server explicitly specifies the file name and suffix via the Content-Disposition header, the browser will use that name.

   `Content-Disposition: attachment; filename="report.pdf"`

2. Response Content-Type Header
   Based on the MIME type of the response, some browsers may attempt to assign an appropriate file suffix.

   `Content-Type: application/pdf`

3. URL Path Contains File Name
   If the URL path of the download appears to include a file name and suffix, the browser may use that part as the file name for the download.

   `https://example.com/download/receipt.pdf`

4. Text or Attribute of the Download Link
   In HTML, the `download` attribute of a download link (e.g., `<a>` element) can specify the file name. If a file name and suffix are provided, the browser will use that name for the download.

### Recommended Measures

To ensure that the downloaded file includes the correct suffix, the following measures are recommended:

- On the server side, set the Content-Disposition and Content-Type headers to ensure that the file name and MIME type are explicitly specified.
- On the client side, when generating Blob files and creating download links via JavaScript, ensure that the file suffix is included when setting the download attribute.

Example Code

```javascript
// Assume you have some data to download
const data = ''

// Create a Blob object representing the data and specify the MIME type
const blob = new Blob([data], { type: 'application/pdf' })

// Generate a URL pointing to the Blob
const url = URL.createObjectURL(blob)

// Create a link element for downloading and set the file name with a suffix
const link = document.createElement('a')
link.href = url
link.download = 'example.pdf' // Ensure the file name includes a suffix
document.body.appendChild(link)

// Trigger the download
link.click()

// Cleanup: Remove the link element and revoke the Blob URL
document.body.removeChild(link)
URL.revokeObjectURL(url)
```
