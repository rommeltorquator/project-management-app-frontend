// src/components/Footer.tsx

import React from 'react';
import { Box, Typography } from '@mui/material';

export const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 2,
        mt: 'auto', // Pushes footer to bottom when content is short
        backgroundColor: (theme) => theme.palette.grey[200],
      }}
    >
      <Typography variant="body2" color="textSecondary" align="center">
        © {new Date().getFullYear()} Rommel Inc. All rights reserved. Let's go!
      </Typography>
    </Box>
  );
};

export default Footer;
