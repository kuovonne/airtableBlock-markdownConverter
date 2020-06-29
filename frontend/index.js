import {
  Box,
  Text,
  initializeBlock,
  useSettingsButton,
} from '@airtable/blocks/ui';
import React, {useState} from 'react';
import MainApp from './mainApp';
import BlockSettings, {validateSettings, validatePermissions} from './blockSettings';


function App() {
  const settings = validateSettings();
  const validPermissions = validatePermissions();
  // if settings are invalid, show settings
  const [isShowingSettings, setIsShowingSettings] = useState(!settings);
  useSettingsButton(()=>setIsShowingSettings(!isShowingSettings));

  if (isShowingSettings) {
    // show the settings screen
    return <BlockSettings setIsShowingSettings={setIsShowingSettings} />
  } else if (!settings) {
    // the settings screen was closed, but the settings are invalid
    // so tell the user to go to the settings screen
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
        <Text textAlign='center' margin='1em'>This block converts text in markdown format to html format.</Text>
        <Text textAlign='center' margin='1em'>Both the markdown and html must be stored in long text fields (not rich text).</Text>
        <Text textAlign='center' margin='1em'>Please configure the settings to use this block.</Text>
      </Box>
    )
  } else if (!validPermissions) {
    // The user doesn't have permission to edit the fields, so tell user that
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
        <Text textAlign='center' margin='1em'>You do not have permission to edit the fields used by this block.</Text>
        <Text textAlign='center' margin='1em'>See the settings for the specific field names.</Text>
      </Box>
    )
  } else {
    // settings and permissions are okay, so show the app
    return <MainApp settings={settings}/>
  }
}


initializeBlock(() => <App />);
