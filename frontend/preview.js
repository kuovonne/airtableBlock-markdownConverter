import {
  Box,
  Heading,
  Text,
} from '@airtable/blocks/ui';
import React from 'react';
import marked from 'marked';

function Preview({settings, table, record}) {
  // unpack the settings and get the markdown text from the record
  const markdownField = table.getFieldByIdIfExists(settings.markdownFieldId);
  const htmlField = table.getFieldByIdIfExists(settings.htmlFieldId);
  const markdownFieldCellValue = record.getCellValue(markdownField.name);
  const markdownText = markdownFieldCellValue ? markdownFieldCellValue : "";
  // convert the markdown to html and save in the html field
  const htmlText = marked(markdownText);
  table.updateRecordAsync(record, {[htmlField.name]: htmlText})
  // most of the screen is the preview of the html in an iframe
  return (
    <Box
      border="none"
      backgroundColor="white"
      padding="15px"
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
    >
      <Heading>
      {record.name ? record.name : 'Unnamed Record'}
      </Heading>
      <Text margin='1em 0'>Converting markdown in the <strong>{markdownField.name}</strong> field
      to html in the <strong>{htmlField.name}</strong> field. <br/>
      A preview of the html appears below.
      </Text>
      <iframe
        srcDoc={"<style>" + settings.customCss + "</style>"+ htmlText}
        style={{width: '100%', height: '100%'}}
      >
      </iframe>
    </Box>
  )
}


export default Preview;
