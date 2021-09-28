
// const keywords = / new |this\.|const |let | of |constructor | function|function | =&gt; /g;
// const keywords_2 = /for |while |if |else if|else |else |return[ \s\;\n]*/g;
// const classes = /class[ \s]+[\w]+[ \s]*{/g;
// const classExp = /new[ \s]+[\w_]+\(/g;
// const funcs = /[\w_]+\(/g;
// const strings = /"[\w \s~\;`!@#\$\%\^&\*\(\)_\+=\-\{\},\.\:\'\$]*"/g;
// const strings2 = /'[\w \s~\;`!@#\$\%\^&\*\(\)_\+=\-\{\},\.\:\"\$]*'/g;
// const regExp = /=[ \s]*\/[\w \s\\\`!@#$%\^&~\%\*\.\,\(\)%_\+\{\}"\;\:\>\?\<\[\]]+\/[\n;]+;/g;
// const arrowFuncs = /[\w_\.]+[ \s]*=[ \s]*\(/g;
// const funcExp = /[\w_\.]+[ \s]*=[ \s]*<span class="kw">[ \s]*function[ \s]*<\/span>/g;
// const indent = /[ ][ ][ ][ ]/g;
// const endline = /[\n]/g;
// const nums = /[0-9]+/g
// const comment = /\/\/[ \s\w_\-\.\,\'\"\!\:\<\>\(\)\*\+\=\&\^\%\$\#\@\?\\\/]*\n/g;
// const highlighted = /<span class=["'][ \s\w_\-\=\+\.\"\'\>]+<\/span>/g;

const keywords = / new |this\.|const |let | of |constructor | function|function |null|private|get| =&gt; /g;
const keywords_2 = /for |while |if |else if|else |else |export|import|return[ \s\;\n]*/g;
const classes = /class[ \s]+[\w]+[ \s]*{/g;
const classExp = /new[ \s]+[\w_]+\(/g;
const funcs = /[\w_]+\(/g;
const strings = /"[\w \s~\;`!@#\$\%\^&\*\(\)_\+=\-\{\},\.\:\'\$\[\]\\\/]*"/g;
const strings2 = /'[\w \s~\;`!@#\$\%\^&\*\(\)_\+=\-\{\},\.\:\"\$\[\]\\\/]*'/g;
const regExp = /=[ \s]*\/[\w \s\\\`!@#$%\^&~\%\*\.\,\(\)%_\+\{\}"\;\:\>\?\<\[\]]+\/[\n;]+;/g;
const arrowFuncs = /[\w_\.]+[ \s]*=[ \s]*\(/g;
const funcExp = /[\w_\.]+[ \s]*=[ \s]*<span class="kw">[ \s]*function[ \s]*<\/span>/g;
const indent = /[ ][ ][ ][ ]/g;
const endline = /[\n]/g;
const nums = /[0-9]+/g;
const comment = /\/\/[ \s\w_\-\.\,\'\"\!\:\<\>\(\)\*\+\=\&\^\%\$\#\@\?\\\/\[\]]*\n/g;
const highlighted = /<span class=["'][ \s\w_\-\=\+\.\"\'\>]+<\/span>/g;

class Highlighter {
    currentText = ""
    element;
    content = "";
    constructor() {
        let elements = Array.from(document.getElementsByClassName("highlight"))
        for (const element of elements) {
            this.element = element;
            this.content = element.innerHTML;
            this.init()
        }
    }

    init = () => {
        this.currentText = "<pre>" + this.element?.innerHTML + "</pre>" || ""

        //escape special characters
        // this.currentText = this.currentText.replace(/>/g, "&gt;")
        // this.currentText = this.currentText.replace(/<\//g, "&lt;/")
        // this.currentText = this.currentText.replace(/</g, "&lt;")
        // this.currentText = this.currentText.replace(endline, "<br>")
        // this.currentText = this.currentText.replace(indent, "<span class='indent'></span>")


        this.highlightStrings()
        this.highlightClasses()
        this.highlightClassExp()
        this.highlightKeywords()
        this.highlightKeywords2()
        this.highlightFuncs()
        this.highlightArrowFuncs()
        this.highlightFuncExp()
        this.highlightComment()

        if (this.element)
            this.element.innerHTML = this.currentText;
    }

    highlightComment = () => {
        let curr = this.currentText.replace(comment, (str: string) => {
            let unhighlighted = str.replace(highlighted, (matched: string) => {

                let rawTextStart = matched.indexOf(">") + 1
                let rawTextEnd = matched.indexOf("</span>")

                return matched.slice(rawTextStart, rawTextEnd)
            })
            return `<span class="comment">${unhighlighted}</span>`
        })

        this.currentText = curr;
    }

    highlightFuncExp = () => {
        let curr = this.currentText.replace(funcExp, (str: string) => {

            const idStart = str.lastIndexOf(".") + 1;
            const idEnd = str.indexOf("=");
            const beforeId = str.slice(0, idStart)
            const afterId = str.slice(idEnd, str.length)

            const id = str.slice(idStart, idEnd)

            return beforeId + `<span class="func">${id}</span>` + afterId;
        })

        this.currentText = curr;
    }

    highlightArrowFuncs = () => {
        let curr = this.currentText.replace(arrowFuncs, (str: string) => {

            const idStart = str.lastIndexOf(".") + 1;
            const idEnd = str.indexOf("=");
            const beforeId = str.slice(0, idStart)
            const afterId = str.slice(idEnd, str.length)

            const id = str.slice(idStart, idEnd)

            return beforeId + `<span class="func">${id}</span>` + afterId;
        })

        this.currentText = curr;
    }

    highlightKeywords = () => {
        let curr = this.currentText.replace(keywords, (str) => {
            if (str === "this.")
                return `<span class="kw">${str.slice(0, 4)}</span>.`
            return `<span class="kw">${str}</span>`
        })
        this.currentText = curr;
    }

    highlightKeywords2 = () => {
        let curr = this.currentText.replace(keywords_2, (str) => {
            return `<span class="kw2">${str}</span>`
        })
        this.currentText = curr;
    }

    highlightClassExp = () => {
        let curr = this.currentText.replace(classExp, (str) => {
            let id = str.slice("new ".length, -1)
            return "<span class='kw'>new</span>" +
                ` <span class='class'>${id}</span>` + "(";
        })

        this.currentText = curr;
    }

    highlightStrings = () => {
        let curr = this.currentText.replace(strings, (str) => {

            let unhighlighted = str.replace(highlighted, (matched: string) => {

                let rawTextStart = matched.indexOf(">") + 1
                let rawTextEnd = matched.indexOf("</span>")

                return matched.slice(rawTextStart, rawTextEnd)
            })

            return `<span class="str">${unhighlighted}</span>`
        })

        curr = curr.replace(strings2, (str) => {

            let unhighlighted = str.replace(highlighted, (matched: string) => {

                let rawTextStart = matched.indexOf(">") + 1
                let rawTextEnd = matched.indexOf("</span>")

                return matched.slice(rawTextStart, rawTextEnd)
            })

            return `<span class="str">${unhighlighted}</span>`
        })

        this.currentText = curr;

    }

    highlightClasses = () => {
        let curr = this.currentText
            .replace(classes, (str) => {
                str = str.trim()
                let kw = str.slice(0, str.indexOf(" "))
                let id = str.slice(str.indexOf(" "), -1)
                // console.log(str.indexOf(" "))
                return `<span class="kw">${kw}</span>` +
                    `<span class="class">${id}</span>` + "{"
            })

        this.currentText = curr
    }

    highlightFuncs = () => {
        let curr = this.currentText.replace(funcs, (str) => this.funcsHelper(str))
        this.currentText = curr
    }

    funcsHelper = (str: string) => {
        let id = str.slice(0, -1)
        return `<span class="func">${id}</span>(`
    }

}


new Highlighter()