import { Td } from "@bluemarble/bm-components";
import { IconButton, Stack, Tooltip } from "@mui/material";
import { MdDelete, MdEdit } from "react-icons/md";

interface ActionsIconsProps {
    rowId: number
    handleActionItem: (id: number, action: any) => void
}

export function ActionsIcons({rowId, handleActionItem}: ActionsIconsProps) {
	return (
        <Td>

        <Stack direction="row" spacing={1}>
        <Tooltip title="Editar">
            <IconButton size="small" onClick={() => handleActionItem(rowId, 'update')}>
                <MdEdit />
            </IconButton>
        </Tooltip>
        <Tooltip title="Deletar">
            <IconButton size="small" onClick={() => handleActionItem(rowId, 'delete')}>
                <MdDelete />
            </IconButton>
        </Tooltip>
    </Stack>
        </Td>
    )
}

