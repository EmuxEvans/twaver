function tooltip() {
  const Tooltip = function() {
    this.mainContent = document.createElement('div');
    this.init();
  };

  Tooltip.prototype.init = function() {
    this.mainContent.style.display = 'block';
    this.mainContent.style['font-family'] = 'Calibri';
    this.mainContent.style['font-size'] = '12px';
    this.mainContent.style.position = 'fixed';
    this.mainContent.style.zIndex = '999';
    this.mainContent.style.padding = '5px';
    this.mainContent.style.background = 'rgba(144,254,144,0.85)';
    this.mainContent.style['border-radius'] = '5px';
    this.mainContent.style.visibility = 'hidden';
  };

  Tooltip.prototype.getView = function() {
    return this.mainContent;
  };

  Tooltip.prototype.setValues = function(value) {
    this.mainContent.innerHTML = value;
  };

  return Tooltip;
}

export default tooltip;
