import {
  Box,
  Button,
  Dialog,
  Text,
  useBase,
  useRecordById,
  useWatchable,
} from '@airtable/blocks/ui';
import {cursor} from '@airtable/blocks';
import React, {useState} from 'react';
import Preview from './preview';

function MainApp({settings}) {
  const base = useBase();
  const table = base.getTableByIdIfExists(settings.tableId);
  const markdownField = table.getFieldByIdIfExists(settings.markdownFieldId);
  const htmlField = table.getFieldByIdIfExists(settings.htmlFieldId);
  const [activeTableId, setActiveTableId] = useState(null);
  const [selectedRecordId, setSelectedRecordId] = useState(null);
  const [selectedFieldId, setSelectedFieldId] = useState(null);

  useWatchable(cursor, ['activeTableId', 'selectedRecordIds', 'selectedFieldIds'], () => {
    setActiveTableId(cursor.activeTableId);
    const matchingTable =  (cursor.activeTableId == table.id)
    if (!matchingTable) {
      setSelectedRecordId("");
      setSelectedFieldId("");
      return;
    }
    if (matchingTable && cursor.selectedRecordIds.length > 0) {
      setSelectedRecordId(cursor.selectedRecordIds[0]);
    }
    if (matchingTable && cursor.selectedFieldIds.length > 0) {
      setSelectedFieldId(cursor.selectedFieldIds[0]);
    }
  });

  const record = useRecordById(table, selectedRecordId ? selectedRecordId : "a_string_because_null_failed");

  if (cursor.activeTableId != table.id) {
    return (
      <Box
        border="none"
        backgroundColor="white"
        padding="15px"
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Text textAlign='center' margin='1em'>
          When you edit the <i>{markdownField.name }</i> field
          in the <i>{table.name}</i> table,
          this block saves an html version in the <i>{htmlField.name}</i> field.
        </Text>
        <Button
          variant="primary"
          onClick={()=>cursor.setActiveTable(table.id)}
        >
        Show Table
        </Button>
      </Box>
    )
  } else if (record && selectedFieldId == markdownField.id) {
    return (
      <Preview
        settings={settings}
        table={table}
        record={record}
      />
    )
  } else if (record && selectedFieldId == htmlField.id) {
    return (
      <Box
        border="none"
        backgroundColor="white"
        padding="15px"
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Text textAlign='center' margin='1em'>Do not edit the <i>{htmlField.name}</i> field directly.
        </Text>
      </Box>
    )
  } else {
    return (
      <Box
        border="none"
        backgroundColor="white"
        padding="15px"
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Text textAlign='center' margin='1em'>
          When you edit the <i>{markdownField.name }</i> field
          in the <i>{table.name}</i> table,
          this block saves an html version in the <i>{htmlField.name}</i> field.
        </Text>
      </Box>
    )
  }
}


export default MainApp;
