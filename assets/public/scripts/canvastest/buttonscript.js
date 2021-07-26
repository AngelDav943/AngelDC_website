function ClickTest() {
    fetch("/public/assets/posts.json", {}).then(res => {
        res.json().then(resp => {
            console.log(resp)
        });
    });
}