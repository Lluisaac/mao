class FormButton extends Button {
	constructor(releasedImage, pressedImage, owningState, form)
	{
		super(releasedImage, pressedImage, owningState, null, 0, 0, FormButton.width, FormButton.height, true, 100);
		this.form = form;
		
		let h = document.createElement("p");
		h.style.position = "absolute";
		h.style.bottom = "0";
		h.style.marginLeft = "16px";
		let t = document.createTextNode("Pour quitter cet écran, cliquez en dehors de cette page.");
		h.appendChild(t);
		this.form.appendChild(h);
	}
	
	static width = 100;
	static height = 100;
	
	action()
	{
		document.body.appendChild(this.form);
		this.func = this.close.bind(this);
		document.body.addEventListener("mousedown", this.func);
	}
	
	close(event)
	{
		let isClickInside = this.form.contains(event.target);

		if (!isClickInside) 
		{
			this.form.remove();
			document.body.removeEventListener("mousedown", this.func);
		}
	}
}