// IdeaCard.tsx - Componente para mostrar una idea individual

import {
    Card, CardContent, CardHeader, Typography, IconButton,
    CardActions, Divider, Button, useTheme, Tooltip, Zoom
  } from '@mui/material';
  import { Edit as EditIcon, FormatQuote as FormatQuoteIcon } from '@mui/icons-material';
  import { Idea } from '../types/idea';
  
  interface Props {
    idea: Idea;
    onWrite: () => void;
    onPreview: () => void;
  }
  
  const IdeaCard = ({ idea, onWrite, onPreview }: Props) => {
    const theme = useTheme();
  
    return (
      <Zoom in>
        <Card
          elevation={3}
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 2,
            transition: 'all 0.3s ease',
            boxShadow: theme.shadows[1],
            '&:hover': {
              transform: 'translateY(-6px)',
              boxShadow: theme.shadows[6],
            }
          }}
        >
          <CardHeader
            title={<Typography sx={{ fontWeight: 'bold' }}>{idea.title}</Typography>}
            subheader={<Typography variant="body2" color="text.secondary">{idea.content.substring(0, 80)}...</Typography>}
            sx={{
              bgcolor: `${theme.palette.primary.light}15`,
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          />
  
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography
              variant="body2"
              sx={{ color: theme.palette.text.primary, lineHeight: 1.6 }}
              gutterBottom
            >
              {idea.content.substring(0, 100)}...
            </Typography>
          </CardContent>
  
          <Divider />
          <CardActions sx={{ p: 2, justifyContent: 'space-between' }}>
            <Button
              onClick={onWrite}
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              Escribir
            </Button>
            <Tooltip title="Ver detalles">
              <IconButton onClick={onPreview}>
                <FormatQuoteIcon />
              </IconButton>
            </Tooltip>
          </CardActions>
        </Card>
      </Zoom>
    );
  };
  
  export default IdeaCard;