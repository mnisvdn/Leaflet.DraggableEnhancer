# Leaflet.DraggableEnhancer

This plugin "_enhances_" the default **L.Draggable** class.  
By default, the **L.Draggable** class is instanciated to allow dragging some objects around, like **L.Map** (which results in panning action in this case). 
  
The fact is, the **L.Draggable** binds the events related to drag (_mousedown_, _mouseup_, _mousemove_, ...) to the main **document** root, which can cause problem if your map has to be instanciated within a **\<div>** you do not master, and has an _event.stopPropagation()_ executed with an handler bound to the _mousemove_ event for example.  
The result is, as long as your mouse will be over this **\<div>**, the map panning won't work.

![L.Draggable Issue](http://i65.tinypic.com/xf18cp.png)
  
This plugin fixes this issue, and also takes care of handling other classes relying on **L.Draggable**, such as **L.Map.BoxZoom**.  

It can also be [found here](http://leafletjs.com/plugins.html#events), under from the official **Leaflet Plugins** repository, under the **#Events** category.

Tested only with **Leaflet 1.0+**  
Goes untested with previous versions **0.7-**

The minified version for production can found in the __dist__ folder.  
You can find source code in both __ES5__ and __ES6__.
