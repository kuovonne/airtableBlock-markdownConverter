import {
  Box,
  Heading,
  Text,
} from '@airtable/blocks/ui';
import React from 'react';
import marked from 'marked';

function Preview({settings, table, record}) {
  const markdownField = table.getFieldByIdIfExists(settings.markdownFieldId);
  const htmlField = table.getFieldByIdIfExists(settings.htmlFieldId);
  const markdownFieldCellValue = record.getCellValue(markdownField.name);
  const markdownText = markdownFieldCellValue ? markdownFieldCellValue : "";
  const htmlText = marked(markdownText);
  table.updateRecordAsync(record, {[htmlField.name]: htmlText})

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
      <Text margin='1em 0'>Converting markdown in the <i>{markdownField.name}</i> field to html in the <i>{htmlField.name}</i> field.</Text>
      <iframe
        srcDoc={"<style>" + settings.customCss + "</style>"+ htmlText}
        style={{width: '100%', height: '100%'}}
      >
      </iframe>
    </Box>
  )
}


export default Preview;
