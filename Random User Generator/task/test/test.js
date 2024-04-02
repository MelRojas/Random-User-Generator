import path from 'path';
import {correct, StageTest, wrong} from 'hs-test-web';

const pagePath = path.join(import.meta.url, '../../src/index.html');

class Test extends StageTest {

    page = this.getPage(pagePath)

    tests = [this.page.execute(() => {
        // test #1
        // HELPERS-->
        // method to check if element with id exists
        this.elementExists = (id, parent=document.body, nodeNames) => {
            const element = parent.querySelector(id);
            if (!element) return true;
            else return (nodeNames && !nodeNames.includes(element.nodeName.toLowerCase()));
        };

        // method to check if element with id has right text
        this.elementHasText = (id, parent=document.body, correctText ) => {
            const element = parent.querySelector(id);
            if (!element || !element.innerText) return true;

            if (correctText) {
                return !(element.innerText.includes(correctText));
            }

            return element.innerText.trim().length === 0;
        };

        // method to check if element with id has right attribute
        this.elementHasAttribute = (id, parent=document.body, attribute, value ) => {
            const element = parent.querySelector(id);
            if (!element) return true;
            const attributeValue = element.getAttribute(attribute);
            if (!attributeValue) return true;
            // console.log(attributeValue);
            return value && !attributeValue.includes(value);
        };

        // check profiles
        this.checkUser = (n= 0) => {
            // const div = `body > div:nth-last-child(${n})`;
            const selector = ".user";
            const containerDivs = document.body.querySelectorAll(selector);
            if (!containerDivs || containerDivs.length === 0) {
                return wrong(`Can't find any element with class '${selector}'`);
            }

            const div = containerDivs[n];
            if (!div) return wrong(`Can't find the number ${n + 1} element with class '${selector}'`);

            const divSelector = `${selector}:nth-child(${n+1})`;

            // h2
            const h2 = ".name";
            let combineSelectors = divSelector + " " + h2;
            if (this.elementExists(h2, div))
                return wrong(this.missingIdMsg(combineSelectors));

            if (this.elementExists(h2, div,["h2"]))
                return wrong(this.wrongTagMsg(combineSelectors , "h2"));

            if (this.elementHasText(h2, div))
                return wrong(this.missingTextMsg(combineSelectors));

            // email
            const email = ".email";
            combineSelectors = divSelector + " " + email;
            if (this.elementExists(email, div))
                return wrong(this.missingIdMsg(combineSelectors));

            if (this.elementExists(email, div, ["p"]))
                return wrong(this.wrongTagMsg(combineSelectors, "p"));

            if (this.elementHasText(email, div,"Email:"))
                return wrong(this.wrongTextMsg(combineSelectors, "Email:"));

            // password
            const password = ".password";
            combineSelectors = divSelector + " " + password;
            if (this.elementExists(password))
                return wrong(this.missingIdMsg(combineSelectors));

            if (this.elementExists(password, div, ["p"]))
                return wrong(this.wrongTagMsg(combineSelectors, "p"));

            if (this.elementHasText(password, div,"Password:"))
                return wrong(this.wrongTextMsg(combineSelectors, "Password:"));

            // location
            const location = ".location";
            combineSelectors = divSelector + " " + location;
            if (this.elementExists(location))
                return wrong(this.missingIdMsg(combineSelectors));

            if (this.elementExists(location, div,["p"]))
                return wrong(this.wrongTagMsg(combineSelectors, "p"));

            if (this.elementHasText(location, div, "Location:"))
                return wrong(this.wrongTextMsg(combineSelectors, "Location:"));

            // phone
            const phone = ".phone";
            combineSelectors = divSelector + " " + phone;
            if (this.elementExists(phone))
                return wrong(this.missingIdMsg(combineSelectors));

            if (this.elementExists(phone, div, ["p"]))
                return wrong(this.wrongTagMsg(combineSelectors, "p"));

            if (this.elementHasText(phone, div, "Phone:"))
                return wrong(this.wrongTextMsg(combineSelectors, "Phone:"));

            // birthday
            const birthday = ".birthday";
            combineSelectors = divSelector + " " + birthday;
            if (this.elementExists(birthday))
                return wrong(this.missingIdMsg(combineSelectors));

            if (this.elementExists(birthday, div, ["p"]))
                return wrong(this.wrongTagMsg(combineSelectors, "p"));

            if (this.elementHasText(birthday, div, "Birthday:"))
                return wrong(this.wrongTextMsg(combineSelectors, "Birthday:"));

            // photo
            const img = ".photo";
            combineSelectors = divSelector + " " + img;
            if (this.elementExists(img))
                return wrong(this.missingIdMsg(combineSelectors));

            if (this.elementExists(img, div,["img"]))
                return wrong(this.wrongTagMsg(combineSelectors, "img"));

            if (this.elementHasAttribute(img, div, "src"))
                return wrong(this.missingAttrMsg(combineSelectors, "src"));

            if (this.elementHasAttribute(img, div,"alt" ))
                return wrong(this.missingAttrMsg(combineSelectors, "alt"));

            this.saveUser(div);

        };


        this.checkH3 = () => {
            if (this.elementExists("h3"))
                return wrong(this.missingIdMsg("h3"));

            if (this.elementExists("h3", document.body, ["h3"]))
                return wrong(this.wrongTagMsg("h3", "h3"));

            if (this.elementHasText("h3", document.body, "Saved Users"))
                return wrong(this.wrongTextMsg("h3", "Saved Users"));
        };

        this.saveUser = (div) => {
            const stored = localStorage.getItem("test");
            localStorage.setItem("test", (stored ? stored + "\n%%" : "")  + div.innerText);
        };

        this.noSavedUsersBeforeClick = () => {
            const selector = ".saved";
            const savedUsers = document.querySelectorAll(selector);
            if (savedUsers.length > 0) {
                return wrong(`There shouldn't be any elements with class '${selector}' before the save-users-button click.`);
            }
        };

        this.checkSavedUser = () => {
            const selector = ".saved";
            const savedUsers = document.querySelectorAll(selector);
            if (!savedUsers || savedUsers.length === 0) {
                return wrong(`Can't find any element with class '${selector}'`);
            }

            const test = localStorage.getItem("test");
            if (!test) return wrong("The localStorage is empty. Do not remove the 'test' item from it.");

            const arrTest = test.split("\n%%");

            for (let i = 0; i < savedUsers.length - 1; i++) {
                const savedUser = savedUsers[i];

                if (savedUser.innerText !== arrTest[i])
                    return wrong(`The saved user in the body of the HTML document does not match the user in the localStorage. The saved user is "${savedUser.innerText}" and the user in the localStorage is "${arrTest[i]}".`);

            }

        };

        // CONSTANTS-->
        const theElement = "The element with the selector of";
        // <--CONSTANTS

        // MESSAGES-->
        this.missingIdMsg = (id) => {
            return `${theElement} "${id}" is missing in the body of the HTML document.`;
        };
        this.wrongTagMsg = (id, tag, tagAlt) => {
            if (tagAlt) return `${theElement} "${id}" should be a/an ${tag} or ${tagAlt} tag.`;
            else return `${theElement} "${id}" should be a/an ${tag} tag.`;
        };
        this.wrongTextMsg = (id, text) => {
            return `${theElement} "${id}" should have the text: "${text}".`;
        };
        this.missingTextMsg = (id) => {
            return `${theElement} "${id}" should have some text.`;
        };
        this.missingAttrMsg = (id, attr) => {
            return `${theElement} "${id}" should have the attribute "${attr}".`;
        };
        this.wrongParentMsg = (id, parentId) => {
            return `${theElement} "${id}" should be a direct child of "${parentId}".`;
        };
        // <--MESSAGES
        return correct();

    }),
        this.node.execute(async () => {
            // test #2
            // set timeout to wait for the page to load

            await new Promise((resolve => {
                setTimeout(() => {
                    resolve();
                }, 3000)
            }));

            return correct();
        }),
        this.page.execute(() => {
            // test #3
            // check api call
            const api = "https://randomuser.me/api";
            const entries = performance.getEntriesByType("resource");
            const entry = entries.find(entry => entry.name.includes(api));
            if (!entry) return wrong("The correct API call is missing.");

            return correct();
        }),
        this.page.execute(() => {
            // test #4
            // check tags

            // h1
            if (this.elementExists("h1"))
                return wrong(this.missingIdMsg("h1"));

            if (this.elementExists("body > h1"))
                return wrong(this.wrongParentMsg("h1", "body"));

            if (this.elementHasText("h1", document.body, "Random User Generator"))
                return wrong(this.wrongTextMsg("h1", "Random User Generator"));

            // check user
            if (this.checkUser()) return this.checkUser();

            // check for button
            const buttonSelector = "#get-user-button";
            if (this.elementExists(buttonSelector))
                return wrong(this.missingIdMsg(buttonSelector));

            if (this.elementExists(buttonSelector, document.body, ["button"]))
                return wrong(this.wrongTagMsg(buttonSelector, "button"));

            if (this.elementHasText(buttonSelector, document.body, "Get User"))
                return wrong(this.missingTextMsg(buttonSelector));

            return correct();
        }),
        this.node.execute(async () => {
            // test #5
            // check for button event
            const buttonSelector = "#get-user-button";
            const button = await this.page.findBySelector(buttonSelector);

            let isEventFired = button.waitForEvent('click', 1000);
            await button.click();

            if (await !isEventFired) return wrong(`Expected click event on button with ${buttonSelector} id!`);

            await new Promise((resolve => {
                setTimeout(() => {
                    resolve();
                }, 3000)
            }));

            await this.page.evaluate(() => {
                return this.checkUser(1);
            });

            await button.click();

            if (await !isEventFired) return wrong(`Expected click event on button with ${buttonSelector} id!`);

            await new Promise((resolve => {
                setTimeout(() => {
                    resolve();
                }, 3000)
            }));

            await this.page.evaluate(() => {
                return this.checkUser(2);
            });

            return correct();
        }),
        this.page.execute(() => {
            // test #6
            // check save button
            const buttonSelector = "#save-users-button";
            if (this.elementExists(buttonSelector))
                return wrong(this.missingIdMsg(buttonSelector));

            if (this.elementExists(buttonSelector, document.body, ["button"]))
                return wrong(this.wrongTagMsg(buttonSelector, "button"));

            if (this.elementHasText(buttonSelector, document.body, "Save Users"))
                return wrong(this.wrongTextMsg(buttonSelector, "Save Users"));

            return correct();

        }),
        this.node.execute(async () => {
            // test #7
            // check no saved uses before click
            await this.page.evaluate(() => {
                return this.noSavedUsersBeforeClick();
            });
            // check button click event
            const buttonSelector = "#save-users-button";
            const button = await this.page.findBySelector(buttonSelector);

            let isEventFired = button.waitForEvent('click', 1000);
            await button.click();

            if (await !isEventFired) return wrong(`Expected click event on button with ${buttonSelector} id!`);

            await new Promise((resolve => {
                setTimeout(() => {
                    resolve();
                }, 3000)
            }));

            // check h3
            await this.page.evaluate(() => {
                return this.checkH3();
            });

            // check saved users
            await this.page.evaluate(() => {
                return this.checkSavedUser();
            });

            await this.page.refresh();

            await new Promise((resolve => {
                setTimeout(() => {
                    resolve();
                }, 3000)
            }));

            return correct();

        }),
        this.page.execute(() => {
            // test #8
            // HELPERS-->
            // method to check if element with id exists
            this.elementExists = (id, parent=document.body, nodeNames) => {
                const element = parent.querySelector(id);
                if (!element) return true;
                else return (nodeNames && !nodeNames.includes(element.nodeName.toLowerCase()));
            };

            // method to check if element with id has right text
            this.elementHasText = (id, parent=document.body, correctText ) => {
                const element = parent.querySelector(id);
                if (!element || !element.innerText) return true;

                if (correctText) {
                    return !(element.innerText.includes(correctText));
                }

                return element.innerText.trim().length === 0;
            };

            this.checkH3 = () => {
                if (this.elementExists("h3"))
                    return wrong(this.missingIdMsg("h3"));

                if (this.elementExists("h3", document.body, ["h3"]))
                    return wrong(this.wrongTagMsg("h3", "h3"));

                if (this.elementHasText("h3", document.body, "Saved Users"))
                    return wrong(this.wrongTextMsg("h3", "Saved Users"));
            };

            this.saveUser = (div) => {
                const stored = localStorage.getItem("test");
                localStorage.setItem("test", (stored ? stored + "\n%%" : "")  + div.innerText);
            };

            this.checkSavedUser = () => {
                const selector = ".saved";
                const savedUsers = document.querySelectorAll(selector);
                if (!savedUsers || savedUsers.length === 0) {
                    return wrong(`Can't find any element with class '${selector}'`);
                }

                const test = localStorage.getItem("test");
                if (!test) return wrong("The localStorage is empty. Do not remove the 'test' item from it.");

                const arrTest = test.split("\n%%");

                for (let i = 0; i < savedUsers.length - 1; i++) {
                    const savedUser = savedUsers[i];

                    if (savedUser.innerText !== arrTest[i])
                        return wrong(`The saved user in the body of the HTML document does not match the user in the localStorage. The saved user is "${savedUser.innerText}" and the user in the localStorage is "${arrTest[i]}".`);
                }

            };

            // CONSTANTS-->
            const theElement = "The element with the selector of";
            // <--CONSTANTS

            // MESSAGES-->
            this.missingIdMsg = (id) => {
                return `${theElement} "${id}" is missing in the body of the HTML document.`;
            };
            this.wrongTagMsg = (id, tag, tagAlt) => {
                if (tagAlt) return `${theElement} "${id}" should be a/an ${tag} or ${tagAlt} tag.`;
                else return `${theElement} "${id}" should be a/an ${tag} tag.`;
            };
            this.wrongTextMsg = (id, text) => {
                return `${theElement} "${id}" should have the text: "${text}".`;
            };
            this.missingTextMsg = (id) => {
                return `${theElement} "${id}" should have some text.`;
            };
            // <--MESSAGES
            return correct();

        }),
        this.node.execute(async () => {
            // test #9
            // check after reload
            await new Promise((resolve => {
                setTimeout(() => {
                    resolve();
                }, 3000)
            }));

            // check h3
            await this.page.evaluate(() => {
                return this.checkH3();
            });

            // check saved users
            await this.page.evaluate(() => {
                return this.checkSavedUser();
            });

            return correct();
        })
    ]

}

it("Test stage", async () => {
    await new Test().runTests()
}).timeout(30000);

