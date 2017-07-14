// The purpose of this class enhancement
// is to prevent the case where the map needs to be inserted in a <div>
// we do not master and that could have prevented propagation for some events
// By default Leaflet binds the 'movemove' and 'moveup'
// directly to the document root
// Example:
// If the container (<div>) where the L.Map is instanciated
// has a 'event.stopPropagation()' for the 'mousemove' event
// and thus map panning does not work
// The trick is to bind the Leaflet 'movemove' and 'moveup' events
// to the map container as well
// so both document and map container can take over from each other
// regarding where the current mouse position
L.Draggable.include({
	// Backup the original _onDown method
	_onDownLegacy : L.Draggable.prototype._onDown,
	// Backup the original finishDrag method
	_finishDragLegacy : L.Draggable.prototype.finishDrag,
	// Called when the starting container 
	// of the move event is the map itself
	_onMoveWrapper : function(e) {
		// This property can be set from other L.Handler
		// such as L.Map.BoxZoom
		// It is to prevent the dragging to go further
		// @todo Perhaps we could just call 'dragging.disable()' instead of setting this property?
		if (this._remotelyDisabled) {
			return;
		}
		L.DomEvent.stopPropagation(e);
		this._onMove(e);
	},
	// Called when the starting container 
	// of the up event is the map itself
	_onUpWrapper : function(e) {
		L.DomEvent.stopPropagation(e);
		this._onUp(e);
	},
	// Call the backuped _onDown method
	// and bind events to the map container itself
	_onDown  : function(e) {
		var type = e.type;
		this._onDownLegacy.call(this, e);
		L.DomEvent
			.on(this._dragStartTarget, L.Draggable.MOVE[type], this._onMoveWrapper, this)
			.on(this._dragStartTarget, L.Draggable.END[type], this._onUpWrapper, this);
	},
	// Call the backuped finishDrag method
	// and unbind events attached the map container itself
	finishDrag : function() {
		var type;
		this._finishDragLegacy.call(this);
		for (type in L.Draggable.MOVE) {
			L.DomEvent
				.off(this._dragStartTarget, L.Draggable.MOVE[type], this._onMoveWrapper, this)
				.off(this._dragStartTarget, L.Draggable.END[type], this._onUpWrapper, this);
		}
	}
});

// We also have to handle the BoxZoom
// because now we binded drag event on the map container
// It conflicts with the BoxZoom handler
L.Map.BoxZoom.include({
	// Backup the original _onMouseDown method
	_onMouseDownLegacy : L.Map.BoxZoom.prototype._onMouseDown,
	// Backup the original _finish method
	_finishLegacy : L.Map.BoxZoom.prototype._finish,
	// When a user click the map when Shift key pressed
	// Call the backuped _onMouseDown method
	// to bind event handles to the document
	// and also bind them to the map container
	_onMouseDown : function(e) {
		// The original _onMouseDown method can return false
		// Not sure if this is supposed to cancel the event bubbling
		// but anyway let's apply the same behaviour there
		var proceed = this._onMouseDownLegacy.call(this, e);
		if (proceed === false) {
			return proceed;
		}
		this
			._handleMapEvents("on")
			._handlePanning(true);
	},
	// Called after the user has drawn a box 
	// for the map to zoom on
	// Call the backuped _finish method
	_finish : function() {
		this._finishLegacy.call(this);
		this
			._handleMapEvents("off")
			._handlePanning(false);
	},
	// Bind or remove events directly
	// on the map container
	_handleMapEvents : function(onOff) {
		L.DomEvent[onOff](this._container, {
			contextmenu : L.DomEvent.stop,
			mousemove   : this._onMouseMove,
			mouseup     : this._onMouseUp,
			keydown     : this._onKeyDown
		}, this);
		return this;
	},
	// Temporary disable the event triggered
	// by map panning
	// It's not a real "disabler"
	// the panning event will trigger
	// but not process their handlers
	_handlePanning : function(trueOrFalse) {
		if (this._map.dragging && this._map.dragging._draggable) {
			this._map.dragging._draggable._remotelyDisabled = trueOrFalse;
		}
		return this;
	}
});