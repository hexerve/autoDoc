# AutoDoc

Now speed up your documentation process by double of its speed.

### About:
As the name indicates, AutoDoc is an app which does the documentation automatically in Zendesk support tool. You can also add the documentation within the same app to recall at a later point of time.

When an employee interacts with the customer, he/she has to do a lot of documentation before attending the next ticket/ customer. Many of the times employees have to do some repetitive tasks. For that, they open multiple articles and then they copy from there and paste in the ticket description box. This is kind of hectic process where "AutoDoc" web app comes in the picture.

This time as well we will not use any external server to store the content for security purpose. We will use the help centre data in our app directly. Our app has two main buttons, one is for search and the other one is to add the documents respectively and both the button will open a different popup window.

First main button "Search" will be used to search the articles/documentation from the help centre. When you click on this button, it will open a window which contains three 3 more buttons and a search box and these buttons are described below.

The first button is for "All" which will be applied to the search criteria based on all the articles. So if you are searching documents/ steps/article no/ error code.. that will be searched in the entire help centre article.

The second button is for "Favorite" which will only have the list of the articles posted by you. If you have a huge list, you can also search any terms using the same search box.

Then we have a third button which enables/disables the Auto-copy feature. The auto-copy feature is really helpful when visiting multiple articles when you are looking for any solution. If this feature is enabled, "Mouse Cursor Selection" is converted into "Copy" feature (CTRL+V) so whenever you try to select some text or line, it will be copied into the clipboard and when you want to paste it to the ticket's description box, you don't have to leave the window, you simply need to press the key combination "CTRL+V" from your left hand to perform this task. If you are selecting the next line of text, it will again be copied in the clipboard and when you press the same keys "CTRL+V", it will be copied in the next line in the tickets description box. This way you don't have to go anywhere and steps will be copied directly into the ticket's description box.

The second main button in the app UI is "Add" which will be used to add the documentation from tickets description to add the articles in the help centre. When you click on this button, it copies the "Subject line as a title" and you will be given the category where you want to add the article in. Once you select the category, you can click on submit. This is how you can add the article in help centre for future use for your self and for your teammates.

Next time when an employee wants to load/search the same, he can simply type the article heading/ document/ content in the "Search" area in our app and then it will open the same articles in the results and then expand the article and select anything, it will be copied in the clipboard which you paste in the description area.

One of the best features of this app will be using the shortcut as a macro but before that, you need to save the documents accordingly. If you are in the ticket's description box, you simply need to press "`" once and then the article no/ error code and then it will be expanded automatically to save your lots of time and speed up the process.

### Stack:

* ZAF (Zendesk App Framwork)
* Zendesk core API
* AJAX
* JavaScript / JQuery
* Bootstrap 4
* HTML

### Core Contributors:

* [Jagdish Singh](https://github.com/JDchauhan)

Please submit bug reports to [https://github.com/hexerve/autoDoc](https://github.com/hexerve/autoDoc). Pull requests are welcome.

### Screenshot(s):
![create article](\assets\screenshot-1.png?raw=true "create article")
![view articles](\assets\screenshot-0.png?raw=true "view articles")
![main app](\assets\screenshot-2.png?raw=true "main app")