new page.loader({
	"res": res,
	"req": req,
	"basetemplate": `${__dirname}/../../assets/server/basetemplates/blogstyle.html`,
	"template": "fs.readFileSync(`${__dirname}/../../pages/backpack.html`).toString()"
}).load()