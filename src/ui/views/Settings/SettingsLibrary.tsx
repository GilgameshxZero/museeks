import electron from 'electron';
import React, { useCallback } from 'react';

import * as Setting from '../../components/Setting/Setting';
import Dropzone from '../../components/SettingDropzone/SettingDropzone';

import * as LibraryActions from '../../actions/LibraryActions';
import * as PlayerActions from '../../actions/PlayerActions';
import { LibraryState } from '../../reducers/library';
import Button from '../../elements/Button/Button';

const { dialog } = electron.remote;

interface Props {
  library: LibraryState;
}

const SettingsLibrary: React.FC<Props> = (props) => {
  const onDrop = useCallback((e: DragEvent) => {
    const files = [];

    if (e.dataTransfer) {
      const eventFiles = e.dataTransfer.files;

      for (let i = 0; i < eventFiles.length; i++) {
        files.push(eventFiles[i].path);
      }

      LibraryActions.add(files).catch((err) => {
        console.warn(err);
      });
    }
  }, []);

  const resetLibrary = useCallback(async () => {
    PlayerActions.stop();
    await LibraryActions.reset();
  }, []);

  const openFolderSelector = useCallback(async () => {
    const result = await dialog.showOpenDialog({
      properties: ['multiSelections', 'openDirectory', 'openFile'],
    });

    if (result.filePaths) {
      LibraryActions.add(result.filePaths).catch((err) => {
        console.warn(err);
      });
    }
  }, []);

  return (
    <div className='setting settings-musicfolder'>
      <Setting.Section>
        <h3 style={{ marginTop: 0 }}>Import music</h3>
        <Dropzone
          title='Add music to the library'
          subtitle='Drop files or folders here'
          onDrop={onDrop}
          onClick={openFolderSelector}
        />
        <Setting.Description>
          This will also scan for <code>.m3u</code> files and create corresponding playlists.
        </Setting.Description>
      </Setting.Section>
      <Setting.Section>
        <h3>Danger zone</h3>
        <Button
          relevancy='danger'
          title='Fully reset the library'
          disabled={props.library.refreshing}
          onClick={resetLibrary}
        >
          Reset library
        </Button>
      </Setting.Section>
    </div>
  );
};

export default SettingsLibrary;
