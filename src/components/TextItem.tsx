// TextItem.tsx - Componente para mostrar cada texto del usuario

import {
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    IconButton,
    Tooltip,
    Typography,
    Box,
    Chip,
    Divider,
    useTheme,
  } from "@mui/material";
  import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as VisibilityIcon,
    AccessTime as AccessTimeIcon,
    TextFields as TextFieldsIcon,
  } from "@mui/icons-material";
  import { Text } from "../types/text";
  
  interface Props {
    text: Text;
    ideaTitle: string;
    onView: () => void;
    onEdit: () => void;
    onDelete: () => void;
    countWords: () => number
  }
  
  const TextItem = ({ text, ideaTitle, onView, onEdit, onDelete, }: Props) => {
    const theme = useTheme();
  
    const countWords =() => {
      const words = text?.content.trim() ? text.content.trim().split(/\s+/).length : 0
      return words
    }

    return (
      <Box>
        <ListItem
          alignItems="flex-start"
          sx={{
            transition: "all 0.2s ease",
            boxShadow: theme.shadows[1],
            "&:hover": {
              bgcolor: `${theme.palette.primary.light}10`,
              transform: "translateX(8px)",
            },
            borderRadius: 2,
            mb: 1,
          }}
        >
          <ListItemAvatar>
            <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>{ideaTitle.charAt(0)}</Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h6" sx={{ fontWeight: "medium" }}>{ideaTitle}</Typography>
                <Box display="flex" gap={1}>
                  <Tooltip title="Ver texto completo">
                    <IconButton size="small" onClick={onView}>
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Editar texto">
                    <IconButton size="small" onClick={onEdit}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar texto">
                    <IconButton size="small" onClick={onDelete}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            }
            secondary={
              <Box mt={1}>
                <Typography variant="body2" sx={{ mb: 1 }}>{text.content.substring(0, 150)}...</Typography>
                <Box display="flex" gap={1} flexWrap="wrap">
                  <Chip
                    icon={<AccessTimeIcon />}
                    label={`${Math.floor(text.time / 60)}:${(text.time % 60).toString().padStart(2, "0")}`}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    icon={<TextFieldsIcon />}
                    label={`${countWords()} palabras`}
                    size="small"
                    variant="outlined"
                  />
                  <Typography variant="caption" sx={{ ml: "auto", fontStyle: "italic" }}>
                    {new Date(text.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
            }
          />
        </ListItem>
        <Divider sx={{ my: 2, opacity: 0.5 }} />
      </Box>
    );
  };
  
  export default TextItem;
  