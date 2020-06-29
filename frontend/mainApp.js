import {
  Box,
  Button,
  Dialog,
  Text,
  colors,
  useBase,
  useRecordById,
  useWatchable,
} from '@airtable/blocks/ui';
import {cursor} from '@airtable/blocks';
import React, {useState} from 'react';
import Preview from './preview';

function MainApp({settings}) {
  // unpack the settings
  const base = useBase();
  const table = base.getTableByIdIfExists(settings.tableId);
  const markdownField = table.getFieldByIdIfExists(settings.markdownFieldId);
  const htmlField = table.getFieldByIdIfExists(settings.htmlFieldId);
  const [activeTableId, setActiveTableId] = useState(null);
  const [selectedRecordId, setSelectedRecordId] = useState(null);
  const [selectedFieldId, setSelectedFieldId] = useState(null);

  // use the cursor to determine the active record and field
  useWatchable(cursor, ['activeTableId', 'selectedRecordIds', 'selectedFieldIds'], () => {
    setActiveTableId(cursor.activeTableId);
    // check if the active table is the table from the settings
    const matchingTable = (cursor.activeTableId == table.id)
    if (!matchingTable) {
      // the active table isn't the settings table, so the selected record & field don't matter
      setSelectedRecordId("");
      setSelectedFieldId("");
      return;
    }
    if (matchingTable && cursor.selectedRecordIds.length > 0) {
      // at least one record is selected, so pick the first
      setSelectedRecordId(cursor.selectedRecordIds[0]);
    }
    if (matchingTable && cursor.selectedFieldIds.length > 0) {
      // at least one field is selected, so pick the first
      setSelectedFieldId(cursor.selectedFieldIds[0]);
    }
  });

  // use the hook to trigger re-renders whenever the record data changes
  const record = useRecordById(table, selectedRecordId ? selectedRecordId : "a_string_because_null_failed");

  if (cursor.activeTableId != table.id) {
    // The active table isn't the table in the settings,
    // so state what the block does, and have button to go to the table
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
          When you edit the <strong>{markdownField.name }</strong> field
          in the <strong>{table.name}</strong> table, <br/>
          this block saves an html version in the <strong>{htmlField.name}</strong> field.
        </Text>
        <Button
          variant="primary"
          onClick={()=>cursor.setActiveTable(table.id)}
        >
        Show <strong>{table.name}</strong> Table
        </Button>
      </Box>
    )
  } else if (record && selectedFieldId == markdownField.id) {
    // the markdown field is selected, so show the preview
    return (
      <Preview
        settings={settings}
        table={table}
        record={record}
      />
    )
  } else if (record && selectedFieldId == htmlField.id) {
    // the html field is selected, but should not be edited directly,
    // so show a warning screen
    return (
      <Box
        border="none"
        backgroundColor={colors.RED_BRIGHT}
        padding="15px"
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Text textAlign='center' margin='1em'>
        Do not edit the <strong>{htmlField.name}</strong> field directly.<br/>
        </Text>
        <Text textAlign='center' margin='1em'>
        Instead, edit the <strong>{markdownField.name}</strong> field <br/>
        and this block will update the <strong>{htmlField.name}</strong> field.
        </Text>
      </Box>
    )
  } else {
    // the table from the settings is active,
    // but a neither the markdown nor the html field is selected
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
        When you edit the <strong>{markdownField.name }</strong> field<br/>
        this block saves an html version in the <strong>{htmlField.name}</strong> field <br/>
        and displays a preview of the html version.
      </Text>
      </Box>
    )
  }
}


export default MainApp;
