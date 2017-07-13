# Leaflet.DraggableEnhancer

This is not a plug-in, but more an "enhancer" of the default L.Draggable class.
By default, the L.Draggable is used to allow dragging some objects around, like L.Map.
The fact is it binds the drag events to the main document root, which can cause problem if your map has to be instanciated within a <div> you do not master, and has a event.stopPropagation() called with an handler bound to the 'mousemove' event for example.
The result is that as long as your mouse will be over this <div>, the map panning won't work.
This enhancer fixes this issue.
