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
  const [isShowingSettings, setIsShowingSettings] = useState(false);

  useSettingsButton(()=>setIsShowingSettings(!isShowingSettings));
  if (isShowingSettings) {
    return <BlockSettings setIsShowingSettings={setIsShowingSettings} />
  } else if (!settings) {
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
        <Text textAlign='center' margin='1em'>Both the markdown and html are stored in long text fields (not rich text).</Text>
        <Text textAlign='center' margin='1em'>Please configure the settings to use this block.</Text>
      </Box>
    )
  } else if (!validPermissions) {
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
    return <MainApp settings={settings}/>
  }
}


initializeBlock(() => <App />);
