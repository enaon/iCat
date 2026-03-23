//euc scaner

ew.UI.nav.next.replaceWith(() => {
    ew.sys.buzz.nav(ew.sys.buzz.type.na);
    //let v=ew.face[0].data.pos+1;
    //ew.UI.c.tcBar(1, v)
});
ew.UI.nav.back.replaceWith(() => {
    ew.sys.buzz.nav(ew.sys.buzz.type.na);
    //let v=ew.face[0].data.pos-1;
    //ew.UI.c.tcBar(-1, v)
});

ew.face[0] = {
    data: {
        source: [],
        pos: 0,
        posL: 0,
        maxVal: 50,
        scanAll: 1,
        key: "rssi",
        img: {
            KingSong: "vk0wkCkQA/AEXdAAnSHektHgoACHng+yHhY+xHhj7vHho+uW5q7vHiB8rPSJ8rHiQ9+XVC4TPlJvMHvANNXUy4HFw491B649kNZL4uAEMv//wAYcCA4f///ykADBgQHCAAQOBAAIIGQY0PDwIDCFwYeGEAgDDiQDCCoYDC+QdECwQmFBAQ9GFQxTFDwQ9FEgR3DHogAC+RfBDwwPGlrvGBwomHHo4hDHpYSHB40CHoweHA4q5IJAa1GHo4aEB4YHDWoZBB6QePHpECFIZzGfQ72HHooDCHpQeEL4yFDHpy5KA4I9QDwo9HBIQyFIAgKCCob3IHo7bGLhA9KKgwwGkDbFHpD2CAYIKDWo0PHowgGCww9HCYofGHIXSHooxBP4x7HHqL+HDY49DAAY9DLh41GSQ49JexHyHovSTQ4WGHoxvECwz+EDwsCHo4IBPQpcG/8gXBL/CDoILBgASC+QDBN4ixFDoQmIPgZoDBQImDKoo8EAH4A/AC6wDeIgPWHsvSB4wOGHswuOBo5MHHs4wEBhi6rABo8mN5QAKPU49/XSY8oPiZ6pPiY8qPiJ6rPiA8tHx48uHxo8wHxY8yAATz1AD4A=",
            Begode: "yMkwhC/AH4AYhvdAAXQIv4ABIwYACI36OESX5HLJHxHEbopI8I4YHHJHY/CHwxQGgEP/4ADBA/wBAQQdBAZHLJA4cFDoQIFG4IQQI4oQIJAo9CH4cNBIoRDDgodBEpAHFKBAIBEI4ZII4qTBSQIDBTQabEFxx2JA4w/INRTYEJYQGC6BHDJBS/HZ6CZLBApHGIIZLCI4jZDDgLdEAYrpFA4o1CAgY+DmAIHDIrYEQYJBE6AFEJAQuIfQwLEKBJhIbApHHRgaKFAArZCWpiHGLhBdEcwwIDNg6QJAAw3EIIr9HFYQTDJg4INJA6QfGIoKDQ5CLFBAxqFSChDGSBYPDCgzdDcIgIFI5CQREog3FWYoQGAYoIMLIgAGSBPQSBD+II4yHLcJQIGJBKQCIgZPESAYAEEoYGEA4pYFBBjYGbJRLFTowlOA45YHbAoIMSA5ICbgZHGP54QHKBRZObgw8DIgRCDSog/ISA52ICBwIHI4w8CIQUAhhHFBQYcHG4gIDCBgzDBBBHKHobUDcYpHDAG5III/xIEAAxH8JBRH9JBJH+AAJH/JJpG/AH4A/AH4AVA=",
            LeaperKim: "yckwhC/AH4A/AH4A/AGEKxGgF1uKAweoxGqgAJFABOIxB4sFwOAJAg1BBIoAJhAPOADwuBPAZIDBIqS+IgWgAgQDBSX4ECGiRdDEgySnhRIQBwZeBxQjIABJcB1AHEEIQHGHoQACSQgKCPgY4BCYoYFFAZHFCpRJDGIQADMoIHFJIIwGBQpIEBIIwKSQanFJBoxDJJpZGSQbaFBIQTGJIySHfJbYBxQkDkUiCgrnDPwSLDAwZeDSQ4TBLQYhCBAZAFJBa3GJAMilBmD1RVDGAh8EMwQjDSQo4GMwo7ECggAHEgpICkUY1RICCAZ+HAAOCOYySLAgaSJdgr5GEgWDJIcilWI1Wg1WqPwyNBc4UKJIqSS0CFGAAgHKI4czmQfDhQlBPwiIFDQQKDSSLzESQ58CSQ+CJAUjmcoD4KSB0CJBfgwyFPgaSSNQiKGXASSMlEihGA1QdDSRTiCKgaSRNQhQHW5RJDSAJ8C1UKL4SSKXwaSUEI5CDF4okFJIRIBCgbwDSRYzFSR4VDZgwADW4QAESQYAEeo2ASRZJESSC3CAAgHHLBpIHcQKSLFYWKSSJBG1QHF0BAGA44fBUghIBDwI7BAAQGFAoRaCxQMED4IKBAgoWB1QADBIIFJAARkCxQODDoolEJAYGCGQ2gBIQTEDogVEACrLGAH73GAH6S/SX6S/JMWKIP4A/AH4A/ABQA==",
            //vt2: "qFSwhC/AH4AohvQCaQnnCaXdA43/AAnwBgonRHQ0PEwooHHg4nQEIQrCAwYoEPCI5FEwYnBEQRXCE7QdBIoYnDGQZ4THApsFE4ozFKB5OGZYwGJhpQNJxYnHBwonSD44HIPCJ2FJwovNE5p2LE5B4RTwweHGA7xQdpYnKeJ4KFTw4nOPBR2GE6CJFPBIxFE6YIEE44wGTw4nKRQp4HE754Hhq0KBAgABE6oHEE5AmCE6yAEE45ODPA6fGZA4IEE44mDFA4nEIwpQIE4wmFFAwnEJxAKGE4h1EAAgnHJxKpGDIgmIKAgnEJxJQCEQYUCJwYGGGwYLDJxQzBGgYUDYJAIFFYR2BoAnLGoRkCSwyoG+DaD7vd6gnJ6lAKARzGABB7EC4MEppQIJoRQDExoPF7o/BUBJMCggQCExxgC+A+DhrIL6ARCUAQnOC4YSMppeC6C2DE5hOBCwMAAQQqNKAKfP+CMCACHUKB7GBRYNEE6KJBZJrFC7onBoAmPV4TJCFBROBCAInBd4QAQKAYoIBITsCEyfdoAVCDwIpEAwjFCE6UN6hQDEIYAEEwJMBJqYqEDAYmHJYRQCAChABDAh6FGgRQWhtE6BAKGYSHDACXUNJYjBTq4aBPIYMJJqxEOLIQnZglAIg4HBErIABolAI4JOHQoRPZJAZOFhtAGYIAaUIydcAAdNJAIgCAYJMcUJACBQIQAfTYQqEAEHdToQAjeQoniE0oA/AH61P7vdAgIDBABHQAhAXCDAQDGE4oXC6AzJD4gSECAwIBE4sNE6YMBE4gjCE4gXDE74RBKwonDDwarIWAoiEAgoXLRxAnHBYQRDE4wKCBYbHScwYbDEIgnYT4ZbFUIhoEE6xCDOYYXEe4onVKIwnLB5BDFJgraEHY4KBUgoPDKoQfECYYFCIoZoEAgYA/AH4AdA",
            NineBot: "vsywhC/AH4A/AH4AGhGAHveIxA+Vg93oA9kxA9Wu65jPi49BuB8/Pn58hHqp8UKKB8BHqp8TgiQlPi4SBSCTCGxAIIBIgqSKIR8FEYbzFXYIsDBxYJFFQQADGow3FKI4kFHAYJCFYRNIDAwJCHoouDJAt0PiA4GBxxWFPgw+CBIw4CPh4vBPggNGI5IJCHow0FBIp8DQogvMJhoJGPg40EQwwRHOQgqDPhAEEJggJGF44EDO4pHHd5IqFI5IEJF44EBfw58HfIh8YAgz0HIQqBHfAh8lOQh8PHgR85BIR87Hoh8cC4h83AAh85AAh8/PnYNBPnQhDPm4gEPnC2CPnwUBPnYEDPnIEEPnAEEPn581BIIXEFQgEHPlQAEFQgAEBJBHEIAp8bAAZ8EFgwJPPkINBOQ9AHxB0CBA58XHwwICgiwHGhIJGCQJ8HAgx8JHwo9CFYw9DGgoSEQ4YSCGgIhCAhJ3GEAaIEAH4A/AH4A/AH4AWA==",
            //nbE: "rlawkFqoA/AH4A/ABERAA8VFckQf4IADgIvgEAImCLAgwEiIrbqIkFFpMBqUiFjSDGABMRiQuXFiRdCiUlFlIuCLigsWFwUjFqTXGFyYsrAAMVFqIsZAAK2RFrcFFyDjWRapbcdCBaXC4xcNqLlFgMRGp0QmRcTiIABCgcvkItOiM/mItFLhgsBiQTCif/FpRmEFoP/CIkBiSIMiMhCQQaBkKKJFo/xAwUhiQtLDAMBCYUf/4tCYAqzECYLHBFoP/kAKBiURgSKJqKbFDAItNLQQtDLgYKCFpFQB4i1BFpBpDRQRaBiMvCgS5FFpBLFIwQtDDYcBWYkQBgItELgsFRBkCC4QtDLoYFEAgYtE+aoFRBjjCFowALFobnDAAQtGS4iIEFqyKMFoiIEFqyKFFowLEh4tEFh8RT4n/J4gtFWwpEEFq8wXBItFWwgtJgItMXAq2JgIVEFq/yFpIJEgYtORJrmCgK4GchQtXcwQtMCowtQiYXFkAtHqItEl4tdmC4HqAFBc4U/FsAkCLYoth+ItIAwIICCgvzFsISBeIQtXiQtPBAYtf+QtHcogtpRAItsRP4tl/4iFCIIAGBQMTC4vxFo9RCQItJkITCABcBl4tPiUikIIBn5xGRB0jIowtCBoQtCqUikcxFpH/mczkQACkYGBAAwWGmAtIkcyLYRxG+YmIAAxFGkCTBFgMVFoVVJQItCj5aHFqq0BLQQtEW4kPFr8hFow1CBgMCFqy4F+ZOBFo4HCFoMBWyotG+LkEFolRFocAOQgtXmAtEFgYtDiINBl4tbkB7BFpsDFrapCFo7mDFoK4EFqShD+S2JFoi4GFqy2FFpkfFrKILXA0CFrCICFpSKJFqqIMFo8DFqgUCDYRaKRQxcCLanxRAhaILg8TFqhaPLg8BDIItSmJaPXJAtSmZaFFpi5GFiUyLQiILLhEjFiHzRARaPFohcCgQtQkRDBLQYtORQahDiU/PociAARnDmQSCLQaIOLg6kCEgbhKLQcQLRxcFFwglD///n//+YtFQ4cBFqREDFoUSEgMxFwX/kMykI9DUIaIQRQouEJwKNEBQi0ELSKKGRgoAIQwZaULgwvLFYgACLSQuFEA0QA4IqHBAQsURYYmCAByHVLgosBP5AAHQ6ouEFYJdBkEAEwtVkIsdFwUQF4MgRwVEikiFYItEFjS6CgECVIJcCAQUBmJZdLokVLwJfBAQQwBFoIsfF4YrCAAUQiEhFcKOEcooA/qoA=",
            //nbZ: "qVawkEogA0oMRAAonfEwwADignmFTgnNFTKfHFL9CE6IoVkIoSfqciE6ZSSoJQDiQohoR4UPaTxSKSonXRoJQmPZ4oaPZooBZi5SOiMBPcwobPZgopADYo/FH4ojZpb0aKRoociBSKKLpSKFB8SAQUhAAKlRFB0SkQABkcymcyiIqFDoIoakczAIIoBAAsAFDczFQRRHKQJ7IPSUimUykQmGAAJSIebkAIwQokiEBiD3IPRwoPZxFBFDgmCFA4mcUgYABPYoo/UhApCFAlBiKjdFAIECFEZ7CFA0QUkEQgKiEgBbDPbqkEBAJ6eFAJzBFAr2gKQIoCZYIofZoYoEPLwoIUQKkgD4RRDGIYojVYQomPVAohgAo/FC6DEZkcResxZCFEMUKIajhEIIonKIjVFerwoCogoiKIgoCewIoeegYojDwQoFPQLNdFAzNBgIoeUQooBQQKtCZcJRCezwdCE4akFUUT2FPbYbCFAp7CFDaiHFAp7adYIoHPYgcQUSJSCC4J7LbQIABBxJ5JPYj3LGwQNKGYQnHe5RyHIwQJKFBLOaCwR5IFAylKPBhQKPYcBFKhnDKBRSDEoJ8SfwgnLZwj4BFJ4nCKBylEC4pPPKBzPGU5gODKCDPFPgQqIBYwnRZ4gdEABIPBPCApEKIJuEABAOBE6hTEFBhhBE6opCPRsBUCQpTgImYAAdAE5EEE7gABFBAYPA",
            //nbS: "q9awkEogAQiIAEigYRFCoAEFMMQOQsBFj1BFIYkBiUikQIBFoIscFIcRkUzAAkykMQLISzXKgRTBKIIABkYrEmQNBLDDMDPgIDBFoYAFkJYCFS8SmQfCGAYnDGgRZBQih/CKA0hFQgxFGAQrRFQQiEAAMz/4AD+ZhCFYqEQFQZWDkc/FIgADFgorRocxFAJXCFJQsDkcyRwJYBkQrOmchFQgpLQwUjCgUhGAIqOmZrCkRUMQoorBkczFZoOBeoYqQFYLvDmc0FRkxkUq0MSFKAAB+UR1EikIrMFQISBxUTFSSwBiWI0MRFZYqC1WCapwrIxJvBmckFRDmBiMa0QqVFYWaWAQqIoQqC1QqWFYOq0MBFZNCkQqCVagrEDYJXKFQWp0YqX//y1SDCVw8ikMa1GiFTArB1GhiMiFY1CkMB1GCFTP/mMoFYMRFRGqwM/FbUhxWggIrGiMQhWql4qa/8q1UAiMUFQ0A1UTFTfzjWgFY1BiKBBa7QAC+OqQQwqBKoOhVjbaCxUQFYqsCkSscAAMSlSCBFYdBGQOiVjiuCjGhgEAVwSBDVjqCCVwMAgKBF0KBe/8h1RWBQQVAAoOqQLyCBjRWBgEEFQca0IqeQQkAKwIqCxSBf/8aFYRWDhWYQL//+UYzRWF1Ehn6CglCCDKwWqj4qfbIOqbIbYjbIUQKwkA1TYgbIKBCKweqiQqg+MaKwqBBK0MhVosB1BWh+UY0JWFwJWixSuBohWDiZWh1CCBQIKtllWqbIJWCgGqVsPxjTYDKwMAK0URVgJWEhURFUExVgJWEgOqj4qf+bRBKwsakM/K0EqbAJWE0UTFT/yiRWFiJeBbMEh1URKwcBiMRiSBgjURQQJWCFYTZf+cQEYIqCQQUBgLZfkAkBiCBBQQIFBgMCFT3xawJWELgIsBiaBfUwRWCFYcRQT0hVoUUFQVBKoIIBmYAcmMQQIMRFQQrBoKLBgZXJEBBVJ+QgBFYIqDbYQJBiYaI+YqHn4+HCIJVBAAIqFogJCIxMzkQAFkf/FYwZBkAfBiAqGoLjBgJzG+c/UZIqFMwUxZ4MAggrGWoMRiQbDPpAtLAoMyD4SBHFYauCn8yPgwALGAQqDQI6CBFYoqBA4QANFYgIDFQ4rJaQoIBPwYJCmlEBAYqMQQcREITgBKhwZBoYqBkIJCigrPCgJJBEYkAAAIGDiQOBK4QqOQQcQFYJ1CDAYKBFQJgEVYgREFRJWEgArCWAQaEapMzkAqOFZLdDKoRWBPwQPEYIiBKFY0TFQqxFA4QqVVwYrBiQqKFYsyWwgqMFY0BOgIhCV4qCEkLhFFRgrFUwIgCKxS3CBQgqNFY8BKxAIDcAIqTFYqEBDgJWGMAI5DBIarNFZZJFMYgqFKqArHEAQtEAwY1GFSIrGEgopKFSYABPRIpKVaIAEDwihFGQYqbQgInEiAFDaophBFKwrCO47+GiEEFTAABoBOFcQ0BFLSxDABRUbFhoaR",
            InMotion: "00ywhC/AH4A/AH4A/AH4A/AH4A/AH4AghvUoBC/AB/d7pS/UiBSB6BD/KSKl/fCPUIP6mRIH6iP7oECgczAAIMD/4DCh////wBYgHGn4IC+YQGAAYhDHIgMDmAIFGAoFEUIRSB6AFBkY1FFYIVCGwpZDEYhRDBIkDKRASBDAYNFKYQpDHg5SJG4YVGHIhKGEYQSB+bABBYQ5FDYpIECYIYCBIPyDAoQEKSBvECoI5EQgwjCDIMyUAiWIZoRgFawZXCHhD+GAAJRBKQY/IDQJSEAwKsEWYkgJogrDBgQ6CMAqTFBQg8GKRaSLKQwLBl5ZFRgpSGgRZIFQYKIXYpvGKRjREIghSDaQQNFPQhLKI5AKFGogACKR4OCIQInGLYTUDAwMzEYbfFKRq5EBRg8DboUgKIkNKQ8jIAR+G+ACCPwQRCb4ZSMIARHDCYJdIBQYqDmBdEKRJhCegbGGFAYCCGohSBZoaeLI4oKGOIYKCD4QxCKRPQKQ5HDKQz7COwSzEKQYKEJYqyEI4YKEKQoDBCQPzKSBsEaI4KCAorxHKQxADAwhmBLpAKFCQKECKRhsFAAQGBiZMEAAQmDKQ4uGKQwTDBRBSBHhQAEKIJSHTwQVDl5SGPIYqEKRQMFY4apECIkgWgxSMPwxSEOYY9BKRZLGIAxSICIoKGBAgjGUowQCBwTtEKREwgRSMeJBSODwMCCohSNEghSIHoZSDCgpSIFghSHCYTxDAAIeDMIg8ECIZSKfoilFJAZXCCghSFIggMHAwSyCSYosDDgo8FKQz3BKQybLVQoZEPYQvBe4hLEKREyDoxSFFoRvEAAMNUoyLFTYpSEAggTE+czmaAGKQxgESoQXDmbIJKRSlCCpB+DBQZDEIAjQDcgpSKBwQsCAAXzYQQVBDogkHfAYIGAH4AJhqkCAH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AAQ=",
            //imV10: "qtawkDmYA3iMViIACiYpimMRqMQFIMQN4MRNsBSDAAsALLxUBiMiFY8QK7p7EAAcRkIKBgJUciEBgJQEFYKxBBIKCamEBJoJ8GgBSBRgRTZD4J/GA4IqCRoRWXEoIbBZIozBFQMABQJWBFSoeBJYQMILoYqXPAbxJG4QqCmcBFSYpDPgUxA4YPDFQYnBKqZTEmD+HEIJVEFSYYEgEQEYT9FVAI6DMoQqQOogiCAwcRAogQFFSQYFAAaAHBooqRFBB5CFZgqQFCQrGbgMBFRh9BgIpSbAIsCFQMRFJwqEfwYANFQUwFRcwJobPKFBIVCDoJ/KmIpCCgYpQQQYqBVRUxiBTDAgKnOFQ0DFQKoKUIQtCU6IqFmIqJiJNDFQJaDABoQEVRY0BSQoZFABkSFQiqImIiFKoRHHPI4MBFQQFBP5IYJVhQJBkJVGiETP5ARDCwbTNW4wqCP5J+BFIoAVkSSCmcAFQwPFAC5EBiEDNwIpIcoYqagMAgYpjWgcQP4qoGVapDCaocAP4gpcNw0AgIqEB4r/Xdoh+BgJ/DKgZnHZ6JCFP4wpaE4QVEKgUQFI5BGU6AqEAgL/BiJ/CPwopVE4oECKYJ/DZiw+MFALUDKhAvbgMwKkCEHKQRUEUaaEOFIZUCXIhUnFjpUOAgT/XKkpAEKjEBKh4ACKigUCkZAEKhIpGKh8SCggpHIA4TEKgQsGVKpCEKg4AiKhIAfKk6ZCXxoAYVYUjP5jUVFIp+FKgYlEFSb7EDAMQFIszgIQDBwIVEFKZTImcwCIgqUiRoFFI6ADE4h/LgAABPIo/EFJAqHEIoAJIJEDFJExKRApMKwgADaQ7VHFKIWBAAxUJmATIFSsAKhJoJP6kQfxIqIFBpUIPxJ/BFQxTOIBApJKgIUGKiLsDPxYqEkIqQfqJ/DH4QqDQBgpHPxZUCX44hDaBkQPxqqIV5AoHBgIpOmIaGf58ACAIYBVBYqHE55dGFJjVEgJSQFIkQFJrVDFCZTRFQinRdQbSNFQrSSHwYpQFQhSRFKcxKqATCFKhVDIgYAHEIZTVawwAJL4aQCFCYABDgSAMaAUBFKoqEFZQLCgYpWa4ZJDKIwICUyjXIbBItBFDJWFFgpaCFDYABmUhPxESkQcPA==",
            //imV11: "rVawkEogA/AH4AYoUhiIADkgrjkUiFYgABFcZXFAAUUQcJXCiRcBLogsgmRYBiStDL4ZagmQjBkU0A4UxgIshPocSFgchFgQteiMQEYaGCAgIIDBIYAYkMQgEAKIgICFgjjaoRYBFgoABA4IGERDUhEYQsGABBYZFYRRGABBaXWIYsQiQsWLAiFOAAMkFalBFiqHVoKCDiAsnE6AsbiMikIbBcB7hWoQrDFiMRFigaFFkqFBAAjhRFi0QFlgoCFiDgUoQYCFickcClCkLhUFitEocikQsSFapaBiUjLgSHOWSgsEmcxDwUQLMsT+cyWpESSYKUDFjX/FggtEFkMzFgq2MFi1DkUzcAQAEFpQsXmYsGAoLkKigsVUo6uCFkFCQY40CBQ46DFikyEIxYCFkKDFLAgsHAwaGVLBQsoFYYsHNgaGVoIsViIsaQogsMQ6ggFFhq0YFi6HToSyKFhESFi1BgEAFlNAFYiFFQxkiFicBFn4sXoLfKFhEiWa1CCwRcBFlTjBFhoAFFi6yGMYYsnK5gsYiIsFiMQFj9BCwUQFgkhiDoCLpQsWgIsERoMBRRcUFkJYcFgKoCFgyNDFjxZKFkglDVoQslRIIsDiAsMiQsdLIYEBAA8UQzACBLIyFJFjZUCFgRYJFitCQYKGCLQQsGiQsGkgsUWYcBEgSzCbAgsGFaYABFg6vBMAYsHiQsYiIsCQ4KvJFjqADLQQAKb6gABbAIsHAAIsJb6gABoIsDQ4YtCcgQ3BWogrVFgIoCcIYtDFhCyWWhIiCBAQsFWSwsGLQgACiAJFWSzhFQ4osEMggrXcIiHGFYY2DQrFEoQsDLQ8BGoiFYWgolBQ4zoEFbKHBE5QAELDSHBFh4raAAMhFZreZLSQrccQyxjLR8SFbwtMFcAABoIlBgIrnLY6DVA=",
            //imV12: "qFawkGswA3scikURAAUikwmdEggAJFq9hDokQgEBE40SEqgZDYRsBE7ArEKIRSDE6x0DogqHPQwkQsTnBkIXCqonGKAIIGOSwAQixxOSYZqFYxYNBkx0MNQoWCYATvMiU2OyomNAAMSTxrCDE9OIE6LvNsUhiUSFQQnSgInNiInltCcFE80YE8UiO4UYwInhT4JPCE8DHBO4gnxgIJBiAIFkwnUDgsABwgLEgMWE5bDBE5ZMCFBAnSgOIE4wmGFAgnRiAnHJw4ACE7DHDEIlUoIoFE7JODolFqJQHE6YZEAYUUJgqhEiQnWExg2CE7VEExInOMQgnHJxaGCE6ERE44mKeAQnYJxZlCExViE5gAME6MAjAnTAAInUKgInmgIniwLeDE/4nNT8gnCd8UBE8NhCAgnWiwnmiQnbitVAANRE65EKqlEE4NFE6UAd4RtMqp3UiAkCiEBTyjwLsMAEYZQNE6kQESx3OswnEPC0iE5QQEE60mE54AWE/J3hkKfaExQnGgAnliInhsQnFPCcSE6RQTiwnLeAifBE8pPCPCUmE6JQFKhwnIsUiBQKfFE40BforHHkQABFAoWIgFQPAYtBBw4rIOpghCE4IbDiClOJwwAEsIREqrxFAgL5HOgLFME5RLFA4IpHE6cQqp4FaIgpEiAnPeAsVE4RQJE4UAiwnOZQsVPBZWEE6p4IeQwMBE6EhE5AoDKopcCEx7wGgp4CEYYFEZgTGPUBJQDDwIlBiEFFgZ2QUBFVqJGCFIQICKYQnSPA4ABTIYGCOyonGKAQoDAgROCOyZ4HKAYAEJwR2TAAMhE4hQEEwp2UAANiKAsAKIj2EJyh4HEAYAEgJOVZIsBNgIlGiCdVKBAqBKYRXCAQImXUIjIBJIItDFQJOYeQwnCOgQmbPIonCgB1bKJBPCEz4oEEoUSkwXPA",
            //rw: "slLwhC/AH4A/AH4A/AFcEpvd6lEAAXU7oAGoAxfGAIAP6gzeGCICCGDcNFRgGIMzRiQAAz3ZEZL7JBogxh6gxCogNJlvQSj4RIGotEAwL3eKJR2EG4RkVproTGQYYBgHUSjgdNPILUBDYRkThpjHDhpkBB4YxUShFAC53UMoIbCGCLjESQQbQglEL4METYKUSGI5/PglNCIQxTew4xRUwUEAgZiUSYVNVyIsCGKT3FAoVEJaFNFgRQBGJ73GG4oABDxYTB6gOBAgL3WGI7gM6iAEe6IsHAAb8LPoIDCDgSUP6lEogxKcBhiBQQZELMxJiTeQlAGL73KSYKUDDYQwSGJKGDSQ4/FhvUCZR+KSiAvFogCBBAKUTGJJtJ6EEUAdEoh2LQBomFHY/UghZCMgTLCbJQxSBIRwCoAnBCYJaBfIaTVfBKJBEgQNBAQ5IEGCgnCRQrQDBwJVCggxCAwIXDGCj4IGIJVCWwYDCNoYwYGJFABAZhCho6BO4wwWfA4nBZYgPDMgJFEN4b4WGYgrBNYw9DIYwxYQQsEogEBogABOQxwGACayFDpQxJZCz4GCCBkZEAobLMhQyUW4tAU6KXYDAnUIiQYHgc/n//+cwGJ59OS5YuB//dmcz//wQRzbUS5FNp/wgYyJDgjgQGJXdgjjCF4MP/6zMb6ZnI6lNKAJiBGgRNKMSAABn4fBMhFED4RkKCQZ2CAB7uBmBkJqBBC+ZmCfBKTSGIJkK6gPBMIRDBVpBiSEIPzWwQyIEIIxDZAoxDAoMDmYACfydATQwxKSoTXBn6DB//zAILwDBISQDH4L6CgbKCWogxCY4YxFogNCBYIAFU4JJBHYnwCIZABp5hCgFUGAZUC+ZMBY4oNDmYeBKYQxDMQoxHl4xDotNMQZgCDYKUHAgKGDNAYxDTQYACIgRjCkAxCghkCKgMvYwQaFCQPUGISzCSAYxBHYgAEn6GBBoIQBDwcNAYJOB+dDDQwxBH4IOCAIQACM4YxIKQQMCMgQNGp7GGUgKPEdwYxRXIdABgaTBa4j4FMQKPDAAoJDGI7IBGIYlFA4K3BDJB0DE4XzmYACOoIxKKYYYFFgT2CAYQAEghiCIQYmGGJyuEAAXwAgbFFWQ8/BwUDMYptDBwa3EXwo1EYowxH973DLwRUIGIzhIGBoXILIgxMWAYwSC4/zGIQ8FBIYlGDQszGBwAdawLzLAH4A/ACg",
        }

    },
    run: false,
    offms: (ew.def.face.off[ew.face.appCurr]) ? ew.def.face.off[ew.face.appCurr] : 60000,
    init: function() {

        ew.is.bar = 0;
        ew.UI.ele.fill("_bar", 6, 0);
        ew.UI.btn.img("main", "_main", 9, "scan", "WAIT", 15, 1, 3);
        ew.UI.btn.c2l("main", "_header", 6, "SCANNING", "", 15, 0, 1.2, 1);

        ew.UI.ele.ind(0, 0, 1, 1);

        // UI control Start
        ew.UI.c.start(1, 1);
        ew.UI.ele.coord("main", "_main", 9);
        ew.UI.c.end();

        // button hander
        ew.UI.c.main._main = (i, l) => {
            if (ew.face[0].dbg) console.log("button: ", i);
            ew.sys.buzz.nav(ew.sys.buzz.type.ok);
            if (this.data.source.length) {
                ew.UI.btn.ntfy(1, 2, 0, "_bar", 6, "CONNECT ?", "", 15, 6, true, false, false);
                ew.UI.c.bar._ntfy = () =>{
                    ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                    ew.apps.euc.state.scanSlot = this.data.source[this.data.pos];
                    if (ew.def.face.info) ew.UI.btn.ntfy(1, 1, 0, "_bar", 6, "EUC INFO ", "SAVED", 0, 15);
                };
            }
            else {
                ew.sys.buzz.nav(ew.sys.buzz.type.na);
                ew.UI.btn.ntfy(1, 1, 0, "_bar", 6, "NO EUC ", "FOUND", 15, 13);
            }


            /*if (l) {
                if (this.data.source.length) {
                    ew.sys.buzz.nav(ew.sys.buzz.type.na);
                    ew.apps.scan.state.def.temp = this.data.source[this.data.pos];
                    if (ew.def.face.info) ew.UI.btn.ntfy(1, 1, 0, "_bar", 6, "EUC INFO ", "SAVED", 0, 15);
                }
                else {
                    ew.sys.buzz.nav(ew.sys.buzz.type.na);
                    ew.UI.btn.ntfy(1, 1, 0, "_bar", 6, "NO EUC ", "FOUND", 15, 13);
                }
            }
            else if (ew.def.face.info) ew.UI.btn.ntfy(1, 1, 0, "_bar", 6, "HOLD TO", "CONNECT", 0, 15);
            */
        };
        this.scan();
        if (!ew.UI.ntid) this.bar();
        this.run = 1;

    },
    show: function() {
        if (!this.run) return;

        if (this.data.source.length) {
            this.graph()

        }


        if (this.tid) clearTimeout(this.tid);
        this.tid = setTimeout(function(t) {
            t.tid = 0;
            t.show();
        }, 1000, this);
    },
    scan: function() {

        let dev = this.data.source;

        NRF.setScan(function(device) {
            //console.log("dev:", device);

            if (device.name) {
                const name = device.name;
                if (name.startsWith("KS-"))
                    device.type = "KingSong";
                else if (name.startsWith("KS-"))
                    device.type = "InMotion";
                else if (name.startsWith("eL-"))
                    device.type = "InMotion";
                else if (name.startsWith("eCe"))
                    device.type = "Inmotion";
                else if (name.startsWith("GW-"))
                    device.type = "Gotway";
                else if (name.startsWith("LP-"))
                    device.type = "LeaperKim";
                else if (name.startsWith("eC-"))
                    device.type = "NineBot";
                else if (name.startsWith("NOE1-"))
                    device.type = "NineBot";
                else if (name.startsWith("NOE2-"))
                    device.type = "NineBot";
                else return;
            }
            else return;


            ew.sys.TC.val = {
                cur: ew.face[0].data.pos,
                dn: 0,
                up: ew.face[0].data.source.length - 1,
                tmp: 0,
                reverce: 0,
                loop: 1
            };

            const id = device.id;
            const devE = dev.find(item => item.id === id);

            if (devE !== undefined) {
                devE.rssi = device.rssi;
                return;
            }
            else {
                let newD = {
                    rssi: device.rssi,
                    name: device.name,
                    type: device.type,
                    id: device.id,

                };

                dev.push(newD);

            }
        }, {
            filters: [
                this.data.scanAll ? {} : // no filter
                { namePrefix: "KS-" },
                { namePrefix: "eL-" },

            ],
            interval: 1000,
            window: 200,
            active: true
        });

    },
    info: function(name, id, type) {

        name = this.data.source[id] ? this.data.source[id].name : name;
        let brd = (this.data.source[id] && this.data.source[id].type) ? this.data.source[id].type : 0;
        let boCo = [0, 0, 0, 6, 1];
        ew.UI.btn.img("main", "_main", 3, type + ".face", "KINGSONG", 15, 1, 1);
        //ew.UI.btn.i2l("main", "_main", 2, oflc ? oflc : rssi + " ", oflc ? "OFFLINE" : (ew.apps.scan.state.def.set.scanAll) ? id.split(" ")[0].toUpperCase() : "dBm", oflc ? 13 : 15, 1, process.env.BOARD === "BANGLEJS2" ? 2 : 3);
        ew.UI.btn.c2l("main", "_main", 6, id.split(" ")[0], "", 15, 1, 0.9);

        //name
        ew.UI.btn.c2l("main", "_header", 6, name, "", 15, 0, 1.2, 1);

    },
    bar: function() {
        if (ew.is.UIpri) { ew.notify.alert("error", ew.notify.log.error[0], 1, 1); return; }

        // reset UI control, bar only
        ew.UI.c.start(0, 1);
        ew.UI.c.end();

        ew.sys.TC.val = {
            cur: this.data.pos,
            dn: 0,
            up: this.data.source.length - 1,
            tmp: 0,
            reverce: 0,
            loop: 1
        };

        ew.UI.c.tcBar = (a, b) => {
            if (b >= 0 && b < this.data.source.length) {
                //print("pos", this.data.pos + 1)
                //ew.UI.ele.ind(this.data.source.length - this.data.pos, this.data.source.length, 0, 15);
                this.data.posL = this.data.pos;
                this.data.pos = b;
                this.graph(true, b); // update mode
                //this.drawInfo();
            }
        };

        ew.is.slide = 1;


        //g.flip();
    },

    graph: function(update, newPos) {
        const margin = 2;
        const width = g.getWidth() - margin;
        const bottom = g.getHeight();
        const graphTop = 130;
        const graphHeight = 45;
        const source = this.data.source;
        const fields = source.length;
        const key = this.data.key;
        const space = 3;


        // Αν δεν υπάρχουν δεδομένα, έξοδος
        if (fields === 0 || ew.UI.ntid) { return; }

        // Μέγιστο πλάτος μπάρας
        const MAX_BAR_WIDTH = 30;

        // Υπολογισμός πλάτους μπάρας και startX (ίδιος με πριν)
        let bw, startX;
        if (fields * (MAX_BAR_WIDTH + space) <= width) {
            bw = MAX_BAR_WIDTH;
            let totalWidth = fields * (bw + space);
            startX = margin + (width - totalWidth) / 2;
        }
        else {
            bw = (width - (fields * space)) / fields;
            startX = margin;
        }

        let scale = graphHeight / this.data.maxVal;

        if (update) {
            let oldPos = this.data.posL;
            newPos;

            // 1. Σβήσε το highlight από την παλιά επιλεγμένη μπάρα
            let oldX = startX + oldPos * (bw + space);
            let oldEntry = this.data.source[oldPos];
            let oldBarH = (100 + oldEntry[key]) * scale;
            let oldColor = 4; // default green
            if ((100 + oldEntry[key]) > 100) oldColor = 13;
            if ((100 + oldEntry[key]) > 120) oldColor = 13;

            g.setCol(1, oldColor);
            g.fillRect(oldX, graphTop + graphHeight - oldBarH, oldX + bw, graphTop + graphHeight);

            // 2. Βάλε highlight στη νέα επιλεγμένη μπάρα
            let newX = startX + newPos * (bw + space);
            let newEntry = this.data.source[newPos];
            let newBarH = (100 + newEntry[key]) * scale;

            g.setCol(1, 15); // highlight color
            g.fillRect(newX, graphTop + graphHeight - newBarH, newX + bw, graphTop + graphHeight);

            // 3. Ζωγράφισε τα περιγράμματα
            //g.setCol(1, 14);
            //    g.drawRect(newX - 1, graphTop - 1, newX + bw + 1, graphTop + graphHeight + 1);

            //return [source[newPos].name, source[newPos].name];
            //this.info(source[newPos].name, source[newPos].id, source[newPos].type)

        }
        else {
            if (!newPos) newPos = this.data.pos;
            ew.UI.ele.fill("_bar", 6, 0);
            // Draw bars
            for (let i = 0; i < fields; i++) {
                let entry = this.data.source[i];
                let barH = (100 + entry[key]) * scale;
                let x = startX + i * (bw + space);
                let isSelected = (i === this.data.pos);

                let color = 4; // 
                if ((100 + entry[key]) > 100) color = 13; // yellow
                if ((100 + entry[key]) > 120) color = 13; // red

                g.setCol(1, isSelected ? 15 : color);
                g.fillRect(x, graphTop + graphHeight - barH, x + bw, graphTop + graphHeight);

            }
            /*
                    // Highlight selected bar
                    if (this.data.pos < fields) {
                        let x = startX + this.data.pos * (bw + space);
                        g.setCol(1, 14);
                        g.drawRect(x - 1, graphTop - 1, x + bw + 1, graphTop + graphHeight + 1);
                    }
            */
        }

        /*if (this.tid) clearTimeout(this.tid);
        this.tid = setTimeout(() => {
            this.tid = 0;
            this.info()
        }, 50)
        */
        //return [source[data[pos]].rssi, data[pos], source[data[pos]].name, source[data[pos]].oflc];
        this.info(source[newPos].name, source[newPos].id, source[newPos].type);

    },

    clear: function(o) {
        ew.is.slide = 0; /*TC.removeAllListeners();*/
        if (this.tid) clearTimeout(this.tid);
        this.tid = 0;
        NRF.setScan();
        return true;
    },
    off: function(o) {
        g.off();
        this.clear(o);
    }
};
