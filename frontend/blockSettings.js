import {
  Button,
  FieldPickerSynced,
  FormField,
  TablePickerSynced,
  Tooltip,
  useBase,
  useGlobalConfig,
} from '@airtable/blocks/ui';
import React, {useState} from 'react';

function BlockSettings({setIsShowingSettings}) {
  // store the settings in globalConfig
  const globalConfig = useGlobalConfig();
  const base = useBase();
  const table = base.getTableByIdIfExists(globalConfig.get('tableId'));
  const customCss = globalConfig.get('customCss');
  const validSettings = validateSettings();
  const canSetSettings = globalConfig.checkPermissionsForSet('customCss').hasPermission;

  return (
    <div style={{padding: '15px', 'height': '100vh'}}>
      <FormField label="Table">
        <TablePickerSynced
          globalConfigKey='tableId'
        />
      </FormField>
      <FormField
        label="Field for markdown (long text)"
        description="Users must have permission to update this field"
      >
        <FieldPickerSynced table={table}
          allowedTypes={["multilineText"]}
          globalConfigKey='markdownFieldId'
        />
      </FormField>
      <FormField
        label="Field for html (long text)"
        description="Users must have permission to update this field"
      >
        <FieldPickerSynced table={table}
          allowedTypes={["multilineText"]}
          globalConfigKey='htmlFieldId'
        />
      </FormField>
      <FormField label="Custom CSS for HTML preview (optional)">
        <textarea
          value={customCss}
          placeholder="Enter custom css to use when displaying the html preview."
          rows= "5"
          style={{width: '100%', resize:'none'}}
          onChange={(e)=>globalConfig.setAsync('customCss', e.target.value)}
          disabled={!canSetSettings}
        />
      </FormField>

      <div style={{display: 'flex', 'justify-content': 'flex-end'}}>
      <Button
        variant="primary"
        onClick={()=>setIsShowingSettings(false)}
        disabled={!validSettings}
        alignSelf="flex-end"
      >
      Done
      </Button>
      </div>
      <details>
        <summary>Credits</summary>
        <p>Copyright © 2020, Kuovonne Vorderbruggen</p>
          <p>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:</p>
          <p>The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.</p>
          <p>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</p>
        <hr />
        <p><b>Marked</b></p>
          <p>Copyright  ©  2011-2018, Christopher Jeffrey (https://github.com/chjj/)</p>
          <p>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:</p>
          <p>The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.</p>
          <p>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</p>
        <hr />
        <p><b>Markdown</b></p>
          <p>Copyright © 2004, John Gruber http://daringfireball.net/ All rights reserved.</p>
          <p>Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:</p>
          <ul>
            <li>Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.</li>
            <li>Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.</li>
            <li>Neither the name “Markdown” nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.</li>
          </ul>
          <p>This software is provided by the copyright holders and contributors “as is” and any express or implied warranties, including, but not limited to, the implied warranties of merchantability and fitness for a particular purpose are disclaimed. In no event shall the copyright owner or contributors be liable for any direct, indirect, incidental, special, exemplary, or consequential damages (including, but not limited to, procurement of substitute goods or services; loss of use, data, or profits; or business interruption) however caused and on any theory of liability, whether in contract, strict liability, or tort (including negligence or otherwise) arising in any way out of the use of this software, even if advised of the possibility of such damage.</p>
      </details>
    </div>
  );
}


function validateSettings() {
  // If the settings are invalid, return false
  // If the settings are valid, return the settings
  const globalConfig = useGlobalConfig();
  const base = useBase();
  // verify there is a table
  const table = base.getTableByIdIfExists(globalConfig.get('tableId'));
  if (!table) { return false; }
  // verify there is a markdownField of the proper field type
  const markdownField = table.getFieldByIdIfExists(globalConfig.get('markdownFieldId'));
  if (!markdownField || markdownField.type != "multilineText") { return false; }
  // verify there is an htmlField of the proper field type
  const htmlField = table.getFieldByIdIfExists(globalConfig.get('htmlFieldId'));
  if (!htmlField || htmlField.type != "multilineText") { return false; }
  // verify the markdownField and htmlField are different from each other
  if (markdownField.id == htmlField.id) { return false; }
  // passed all checks
  return {
    "tableId": table.id,
    "markdownFieldId": markdownField.id,
    "htmlFieldId": htmlField.id,
    "customCss": globalConfig.get('customCss') ? globalConfig.get('customCss') : "",
  };
}


function validatePermissions() {
  // If user doesn't have the permissions needed to run the block, return false
  // If does have the necessary permissions, return true
  // get the table and fields
  const globalConfig = useGlobalConfig();
  const base = useBase();
  const table = base.getTableByIdIfExists(globalConfig.get('tableId'));
  if (! table) { return false }
  const markdownField = table.getFieldByIdIfExists(globalConfig.get('markdownFieldId'));
  const htmlField = table.getFieldByIdIfExists(globalConfig.get('htmlFieldId'));
  if (!markdownField || !htmlField) { return false }
  // perform the permissions check
  const updateRecordCheckResult =
    table.checkPermissionsForUpdateRecord(undefined, {
      [markdownField.name]: 'test string',
      [htmlField.name]: 'test string',
    });
  // return results of the permission check
  return updateRecordCheckResult.hasPermission;
}


export {validateSettings, validatePermissions};
export default BlockSettings;
