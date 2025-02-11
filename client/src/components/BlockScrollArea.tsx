import React from 'react';
import { ScrollArea, Grid } from '@mantine/core';

function BlockScrollArea({blockList}) {
  return (
    <ScrollArea h={250} type="always" scrollbarSize={12}>
      {blockList.map((block, index) => 
        <Grid>
          <Grid.Col span={3} key={index}> block </Grid.Col>
        </Grid>
      )}
    </ScrollArea>
  );
}