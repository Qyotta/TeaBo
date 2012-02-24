package de.bht.swp.lao.ocp.whiteboarditem;

public class WhiteboardItemDao extends
        AbstractWhiteboardItemDao<WhiteboardItem> {

    @Override
    public Class<WhiteboardItem> getType() {
        return WhiteboardItem.class;
    }

}
